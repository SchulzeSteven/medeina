<?php
declare(strict_types=1);
require __DIR__ . '/stripe-common.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    reply(405, ['error' => 'method_not_allowed']);
}
$config = test_config();
if (!str_starts_with($config['publishableKey'], 'pk_test_')) {
    reply(503, ['error' => 'stripe_not_configured']);
}
checkout_session();
reply(200, ['publishableKey' => $config['publishableKey'], 'csrfToken' => $_SESSION['csrf']]);
