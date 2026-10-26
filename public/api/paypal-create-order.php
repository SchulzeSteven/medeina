<?php
declare(strict_types=1);
require __DIR__ . '/paypal-common.php';
$body = paypal_request_body();
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
$key = hash('sha256', session_id() . ':' . $attemptId . ':' . $productId);
$data = paypal_api(
    '/v2/checkout/orders',
    [
        'intent' => 'CAPTURE',
        'purchase_units' => [
            [
                'reference_id' => $productId,
                'description' => 'Medeina TEST: ' . $productId,
                'amount' => [
                    'currency_code' => 'EUR',
                    'value' => number_format($prices[$productId] / 100, 2, '.', ''),
                ],
            ],
        ],
    ],
    substr($key, 0, 38),
);
if (empty($data['id']) || !preg_match('/^[A-Z0-9]+$/D', $data['id'])) {
    reply(502, ['error' => 'invalid_paypal_response']);
}
$_SESSION['paypal_orders'][$data['id']] = [
    'productId' => $productId,
    'amount' => $prices[$productId],
];
reply(200, ['id' => $data['id']]);
