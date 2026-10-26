<?php
declare(strict_types=1);
require __DIR__ . '/stripe-common.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(405, ['error' => 'method_not_allowed']);
}
if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
    reply(415, ['error' => 'json_required']);
}
checkout_session();
$csrf = $_SERVER['HTTP_X_CHECKOUT_TOKEN'] ?? '';
if (!$csrf || !hash_equals($_SESSION['csrf'], $csrf)) {
    reply(403, ['error' => 'invalid_session']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 2048) {
    reply(413, ['error' => 'request_too_large']);
}
$body = json_decode(file_get_contents('php://input', false, null, 0, 2049), true);
if (!is_array($body)) {
    reply(400, ['error' => 'invalid_request']);
}
$productId = $body['productId'] ?? null;
$attemptId = $body['attemptId'] ?? null;
$prices = product_prices();
if (
    !is_string($productId) ||
    !isset($prices[$productId]) ||
    !is_string($attemptId) ||
    !preg_match('/^[a-f0-9-]{36}$/D', $attemptId)
) {
    reply(400, ['error' => 'invalid_product_or_attempt']);
}
$config = test_config();
if (
    !is_stripe_test_secret($config['secretKey']) ||
    !str_starts_with($config['publishableKey'], 'pk_test_')
) {
    reply(503, ['error' => 'stripe_test_keys_required']);
}
if (!function_exists('curl_init')) {
    reply(503, ['error' => 'curl_required']);
}
$now = time();
$requests = array_filter($_SESSION['requests'] ?? [], fn($at) => $at > $now - 60);
if (count($requests) >= 20) {
    reply(429, ['error' => 'try_later']);
}
$requests[] = $now;
$_SESSION['requests'] = $requests;
$idempotencyKey = hash('sha256', session_id() . ':' . $productId . ':' . $attemptId);
session_write_close();
$curl = curl_init('https://api.stripe.com/v1/payment_intents');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 25,
    CURLOPT_USERPWD => $config['secretKey'] . ':',
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded',
        'Idempotency-Key: ' . $idempotencyKey,
    ],
    CURLOPT_POSTFIELDS => http_build_query([
        'amount' => $prices[$productId],
        'currency' => 'eur',
        'allowed_payment_method_types' => ['card'],
        'metadata' => ['product_id' => $productId, 'source' => 'medeina_test_checkout'],
        'description' => 'Medeina TEST: ' . $productId,
    ]),
]);
$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
if ($response === false) {
    error_log('Medeina Stripe transport: ' . curl_error($curl));
}
unset($curl);
$data = is_string($response) ? json_decode($response, true) : null;
if ($status >= 400) {
    error_log(
        'Medeina Stripe API status ' . $status . ', code ' . ($data['error']['code'] ?? 'unknown'),
    );
}
if (
    $status < 200 ||
    $status >= 300 ||
    !is_array($data) ||
    empty($data['client_secret']) ||
    ($data['livemode'] ?? true) !== false
) {
    reply(502, ['error' => 'stripe_unavailable']);
}
reply(200, [
    'clientSecret' => $data['client_secret'],
    'amount' => $data['amount'],
    'currency' => $data['currency'],
]);
