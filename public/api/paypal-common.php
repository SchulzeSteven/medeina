<?php
declare(strict_types=1);
require __DIR__ . '/stripe-common.php';
function paypal_config(): array
{
    $path = getenv('MEDEINA_PAYPAL_CONFIG') ?: dirname(__DIR__, 3) . '/medeina-paypal-config.php';
    $config = is_file($path) ? require $path : [];
    if (!is_array($config)) {
        $config = [];
    }
    return [
        'clientId' => getenv('MEDEINA_PAYPAL_CLIENT_ID') ?: $config['clientId'] ?? '',
        'secret' => getenv('MEDEINA_PAYPAL_SECRET') ?: $config['secret'] ?? '',
    ];
}
function paypal_request_body(): array
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        reply(405, ['error' => 'method_not_allowed']);
    }
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        reply(415, ['error' => 'json_required']);
    }
    checkout_session();
    if (
        empty($_SERVER['HTTP_X_CHECKOUT_TOKEN']) ||
        !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CHECKOUT_TOKEN'])
    ) {
        reply(403, ['error' => 'invalid_session']);
    }
    $body = json_decode(file_get_contents('php://input', false, null, 0, 2049), true);
    if (!is_array($body)) {
        reply(400, ['error' => 'invalid_request']);
    }
    $requests = array_filter($_SESSION['paypal_requests'] ?? [], fn($at) => $at > time() - 60);
    if (count($requests) >= 20) {
        reply(429, ['error' => 'try_later']);
    }
    $requests[] = time();
    $_SESSION['paypal_requests'] = $requests;
    return $body;
}
function paypal_api(string $path, ?array $body = null, string $requestId = ''): array
{
    $config = paypal_config();
    if (!$config['clientId'] || !$config['secret'] || !function_exists('curl_init')) {
        reply(503, ['error' => 'paypal_sandbox_not_configured']);
    }
    $curl = curl_init('https://api-m.sandbox.paypal.com/v1/oauth2/token');
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_USERPWD => $config['clientId'] . ':' . $config['secret'],
        CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
    ]);
    $tokenResponse = curl_exec($curl);
    $tokenStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    unset($curl);
    $token = is_string($tokenResponse) ? json_decode($tokenResponse, true) : null;
    if ($tokenStatus !== 200 || empty($token['access_token'])) {
        reply(502, ['error' => 'paypal_sandbox_unavailable']);
    }
    $curl = curl_init('https://api-m.sandbox.paypal.com' . $path);
    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $token['access_token'],
        'Prefer: return=representation',
    ];
    if ($requestId) {
        $headers[] = 'PayPal-Request-Id: ' . $requestId;
    }
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $body === null ? '{}' : json_encode($body),
    ]);
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    unset($curl);
    $data = is_string($response) ? json_decode($response, true) : null;
    if ($status < 200 || $status >= 300 || !is_array($data)) {
        reply(502, ['error' => 'paypal_sandbox_unavailable']);
    }
    return $data;
}
