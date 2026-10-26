<?php
declare(strict_types=1);
require __DIR__ . '/paypal-common.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    reply(405, ['error' => 'method_not_allowed']);
}
$config = paypal_config();
checkout_session();
$configured = (bool) ($config['clientId'] && $config['secret']);
reply(200, [
    'clientId' => $configured ? $config['clientId'] : 'sb',
    'configured' => $configured,
    'sandbox' => true,
    'csrfToken' => $_SESSION['csrf'],
]);
