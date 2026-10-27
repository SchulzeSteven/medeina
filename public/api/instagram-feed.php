<?php
declare(strict_types=1);
ini_set('display_errors', '0');
require __DIR__ . '/instagram-common.php';
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function instagram_reply(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode(
        $body,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE,
    );
    exit();
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    instagram_reply(405, ['error' => 'method_not_allowed']);
}
$config = instagram_config();
if (
    !is_string($config['accessToken']) ||
    !$config['accessToken'] ||
    preg_match('/[\r\n]/', $config['accessToken']) ||
    !in_array($config['login'], ['instagram', 'facebook'], true) ||
    !is_string($config['userId']) ||
    !preg_match('/^(?:me|\d+)$/D', $config['userId']) ||
    ($config['login'] === 'facebook' && $config['userId'] === 'me') ||
    !is_string($config['apiVersion']) ||
    !preg_match('/^v\d+\.0$/D', $config['apiVersion']) ||
    !is_string($config['username']) ||
    strtolower($config['username']) !== 'medeinaland' ||
    !function_exists('curl_init')
) {
    instagram_reply(503, ['error' => 'instagram_not_configured']);
}

// Cache only the public, normalized result outside the document root.
// Include configuration identity so a changed token/account cannot reuse an old result.
$cachePath =
    sys_get_temp_dir() . '/medeina-instagram-' . hash('sha256', json_encode($config)) . '.json';
$cache = fopen($cachePath, 'c+');
if (!$cache || !flock($cache, LOCK_EX | LOCK_NB)) {
    if (is_resource($cache)) {
        fclose($cache);
    }
    instagram_reply(503, ['error' => 'instagram_busy']);
}
chmod($cachePath, 0600);
try {
    $stored = json_decode(stream_get_contents($cache), true);
    if (is_array($stored) && ($stored['expiresAt'] ?? 0) > time()) {
        $status = $stored['status'];
        $body = $stored['body'];
    } else {
        try {
            $profile = instagram_api($config, $config['userId'], ['fields' => 'id,username']);
            if (strtolower($profile['username'] ?? '') !== 'medeinaland') {
                throw new RuntimeException('instagram_account_mismatch');
            }
            $result = instagram_api($config, $config['userId'] . '/media', [
                'fields' => 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
                'limit' => 50,
            ]);
            if (!is_array($result['data'] ?? null)) {
                throw new RuntimeException('invalid_media');
            }
            $body = ['posts' => instagram_posts($result['data'])];
            $status = 200;
        } catch (Throwable $error) {
            $status = 502;
            $body = ['error' => 'instagram_unavailable'];
        }
        rewind($cache);
        ftruncate($cache, 0);
        fwrite(
            $cache,
            json_encode(
                [
                    'expiresAt' => time() + ($status === 200 ? 600 : 60),
                    'status' => $status,
                    'body' => $body,
                ],
                JSON_INVALID_UTF8_SUBSTITUTE,
            ),
        );
        fflush($cache);
    }
} finally {
    flock($cache, LOCK_UN);
    fclose($cache);
}
instagram_reply($status, $body);
