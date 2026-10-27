<?php
declare(strict_types=1);

function instagram_config(): array
{
    $explicit = getenv('MEDEINA_INSTAGRAM_CONFIG');
    $paths = $explicit
        ? [$explicit]
        : [
            dirname(__DIR__, 3) . '/medeina-instagram-config.php',
            dirname(__DIR__, 2) . '/medeina-private/medeina-instagram-config.php',
            dirname(__DIR__, 2) . '/server/medeina-instagram-config.php',
        ];
    $config = [];
    foreach ($paths as $path) {
        if (is_file($path)) {
            $config = require $path;
            break;
        }
    }
    $config = is_array($config) ? $config : [];
    return [
        'accessToken' => getenv('MEDEINA_INSTAGRAM_TOKEN') ?: $config['accessToken'] ?? '',
        'login' => $config['login'] ?? 'instagram',
        'userId' => $config['userId'] ?? 'me',
        'apiVersion' => $config['apiVersion'] ?? 'v25.0',
        'username' => $config['username'] ?? 'medeinaland',
    ];
}

function instagram_api(array $config, string $edge, array $query): array
{
    $host = $config['login'] === 'facebook' ? 'graph.facebook.com' : 'graph.instagram.com';
    $url =
        'https://' .
        $host .
        '/' .
        $config['apiVersion'] .
        '/' .
        $edge .
        '?' .
        http_build_query($query);
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $config['accessToken']],
    ]);
    $response = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    unset($curl);
    $data = is_string($response) ? json_decode($response, true) : null;
    if ($status !== 200 || !is_array($data) || isset($data['error'])) {
        // Do not expose or log provider bodies, URLs, or tokens.
        throw new RuntimeException('instagram_unavailable');
    }
    return $data;
}

function instagram_https_url(mixed $value): bool
{
    return is_string($value) &&
        filter_var($value, FILTER_VALIDATE_URL) &&
        parse_url($value, PHP_URL_SCHEME) === 'https' &&
        !parse_url($value, PHP_URL_USER) &&
        !parse_url($value, PHP_URL_PASS);
}

function instagram_posts(array $media): array
{
    $posts = [];
    foreach ($media as $item) {
        if (!is_array($item)) {
            continue;
        }
        $id = $item['id'] ?? '';
        $type = $item['media_type'] ?? '';
        $url = $type === 'VIDEO' ? $item['thumbnail_url'] ?? '' : $item['media_url'] ?? '';
        $link = $item['permalink'] ?? '';
        $timestamp = $item['timestamp'] ?? '';
        if (
            !is_string($id) ||
            !preg_match('/^\d+$/D', $id) ||
            isset($posts[$id]) ||
            !in_array($type, ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'], true) ||
            !instagram_https_url($url) ||
            !instagram_https_url($link) ||
            !in_array(
                parse_url($link, PHP_URL_HOST),
                ['instagram.com', 'www.instagram.com'],
                true,
            ) ||
            !is_string($timestamp) ||
            strtotime($timestamp) === false
        ) {
            continue;
        }
        $posts[$id] = [
            'id' => $id,
            'permalink' => $link,
            'imageUrl' => $url,
            'caption' => is_string($item['caption'] ?? null) ? $item['caption'] : '',
            'publishedAt' => gmdate('c', strtotime($timestamp)),
            'mediaType' => $type,
        ];
    }
    $posts = array_values($posts);
    usort($posts, static fn($a, $b) => strcmp($b['publishedAt'], $a['publishedAt']));
    return array_slice($posts, 0, 6);
}
