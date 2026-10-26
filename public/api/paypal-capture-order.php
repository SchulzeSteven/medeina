<?php
declare(strict_types=1);
require __DIR__ . '/paypal-common.php';
$body = paypal_request_body();
$id = $body['orderId'] ?? null;
if (
    !is_string($id) ||
    !preg_match('/^[A-Z0-9]{5,40}$/D', $id) ||
    !isset($_SESSION['paypal_orders'][$id])
) {
    reply(400, ['error' => 'unknown_order']);
}
$order = $_SESSION['paypal_orders'][$id];
if (!empty($order['completed'])) {
    reply(200, ['status' => 'COMPLETED']);
}
$data = paypal_api(
    '/v2/checkout/orders/' . $id . '/capture',
    null,
    substr(hash('sha256', session_id() . ':capture:' . $id), 0, 38),
);
$capture = $data['purchase_units'][0]['payments']['captures'][0] ?? [];
if (
    ($data['id'] ?? '') !== $id ||
    ($data['status'] ?? '') !== 'COMPLETED' ||
    ($capture['status'] ?? '') !== 'COMPLETED' ||
    ($capture['amount']['currency_code'] ?? '') !== 'EUR' ||
    ($capture['amount']['value'] ?? '') !== number_format($order['amount'] / 100, 2, '.', '')
) {
    reply(502, ['error' => 'payment_not_completed']);
}
$_SESSION['paypal_orders'][$id]['completed'] = true;
reply(200, ['status' => 'COMPLETED']);
