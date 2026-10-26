<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $status, array $data): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}
function test_config(): array
{
    $path = getenv('MEDEINA_STRIPE_CONFIG') ?: dirname(__DIR__, 3) . '/medeina-stripe-config.php';
    $config = is_file($path) ? require $path : [];
    if (!is_array($config)) {
        $config = [];
    }
    return [
        'publishableKey' => getenv('MEDEINA_STRIPE_PUBLIC_KEY') ?: $config['publishableKey'] ?? '',
        'secretKey' => getenv('MEDEINA_STRIPE_SECRET_KEY') ?: $config['secretKey'] ?? '',
    ];
}
function checkout_session(): void
{
    ini_set('session.use_strict_mode', '1');
    session_name('medeina_checkout');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Strict',
        'path' => '/',
    ]);
    session_start();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
}
function product_prices(): array
{
    return [
        'achtsamkeitsjournal' => 2490,
        'meditation-ankommen' => 1490,
        'impulskarten' => 1990,
        'abendritual' => 990,
        'reflexionsheft' => 1790,
        'gutschein' => 5000,
    ];
}
function is_stripe_test_secret(string $key): bool
{
    return (bool) preg_match('/^(?:sk_test_|rk_test_|rkcs_test_)/', $key);
}
