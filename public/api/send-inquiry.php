<?php
declare(strict_types=1);

ini_set('display_errors', '0');
require __DIR__ . '/inquiry-email.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function inquiry_reply(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if (!in_array($method, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    inquiry_reply(405, ['error' => 'method_not_allowed']);
}

ini_set('session.use_strict_mode', '1');
session_name('medeina_inquiry');
session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Strict',
    'path' => '/',
]);
session_start();
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));

if ($method === 'GET') {
    inquiry_reply(200, ['token' => $_SESSION['csrf']]);
}

if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
    inquiry_reply(415, ['error' => 'json_required']);
}
if (!hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_INQUIRY_TOKEN'] ?? '')) {
    inquiry_reply(403, ['error' => 'invalid_session']);
}

$raw = file_get_contents('php://input', false, null, 0, 32769);
if ($raw === false || strlen($raw) > 32768) {
    inquiry_reply(413, ['error' => 'request_too_large']);
}
$body = json_decode($raw, true);
if (!is_array($body)) {
    inquiry_reply(400, ['error' => 'invalid_request']);
}

$inquiry = [];
foreach (
    ['name' => 120, 'email' => 254, 'interest' => 180, 'message' => 5000, 'language' => 2]
    as $field => $limit
) {
    if (!isset($body[$field]) || !is_string($body[$field]) || mb_strlen($body[$field]) > $limit) {
        inquiry_reply(422, ['error' => 'invalid_fields']);
    }
    $inquiry[$field] = trim($body[$field]);
}
if (
    $inquiry['name'] === '' ||
    $inquiry['interest'] === '' ||
    !filter_var($inquiry['email'], FILTER_VALIDATE_EMAIL) ||
    preg_match('/[\r\n]/', $inquiry['email']) ||
    !in_array($inquiry['language'], ['de', 'tr', 'en'], true) ||
    !is_string($body['requestId'] ?? null) ||
    !preg_match('/^[a-f0-9-]{36}$/i', $body['requestId'])
) {
    inquiry_reply(422, ['error' => 'invalid_fields']);
}

$configPath = getenv('MEDEINA_RESEND_CONFIG') ?: dirname(__DIR__, 3) . '/medeina-resend-config.php';
if (!is_file($configPath) && !getenv('MEDEINA_RESEND_CONFIG')) {
    $candidates = [
        dirname(__DIR__, 2) . '/medeina-private/medeina-resend-config.php',
        dirname(__DIR__, 2) . '/server/medeina-resend-config.php',
    ];
    foreach ($candidates as $candidate) {
        if (is_file($candidate)) {
            $configPath = $candidate;
            break;
        }
    }
}
$config = is_file($configPath) ? require $configPath : [];
$config = is_array($config) ? $config : [];
$apiKey = getenv('RESEND_API_KEY') ?: $config['apiKey'] ?? '';
$recipient = getenv('MEDEINA_INQUIRY_TO') ?: $config['to'] ?? '';
$sender = getenv('MEDEINA_INQUIRY_FROM') ?: $config['from'] ?? 'Medeina <onboarding@resend.dev>';
if (!$apiKey || !filter_var($recipient, FILTER_VALIDATE_EMAIL) || !function_exists('curl_init')) {
    inquiry_reply(503, ['error' => 'email_not_configured']);
}

$attempts = array_values(
    array_filter($_SESSION['attempts'] ?? [], static fn($time) => $time > time() - 600),
);
// Test installations can allow more attempts without changing the production default.
$attemptLimit = max(1, min(100, (int) ($config['attemptLimit'] ?? 5)));
if (count($attempts) >= $attemptLimit) {
    header('Retry-After: 600');
    inquiry_reply(429, ['error' => 'try_later']);
}
$attempts[] = time();
$_SESSION['attempts'] = $attempts;
// Release the session lock while waiting for the mail provider.
session_write_close();

$logo = file_get_contents(dirname(__DIR__) . '/images/logo-footer.png');
if ($logo === false) {
    inquiry_reply(503, ['error' => 'email_not_configured']);
}
$email = inquiry_email($inquiry);
$payload = [
    'from' => $sender,
    'to' => [$recipient],
    'reply_to' => $inquiry['email'],
    'subject' => $email['subject'],
    'html' => $email['html'],
    'text' => $email['text'],
    'attachments' => [
        [
            'filename' => 'logo-footer.png',
            'content' => base64_encode($logo),
            'content_type' => 'image/png',
            'content_id' => 'medeina-logo',
        ],
    ],
];

$curl = curl_init('https://api.resend.com/emails');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 25,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'Idempotency-Key: inquiry-' . $body['requestId'],
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
]);
$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
unset($curl);
$result = is_string($response) ? json_decode($response, true) : null;
if ($status < 200 || $status >= 300 || !is_string($result['id'] ?? null)) {
    // Provider responses may contain account details; keep them out of the public API.
    inquiry_reply(502, ['error' => 'email_unavailable']);
}

inquiry_reply(200, ['sent' => true]);
