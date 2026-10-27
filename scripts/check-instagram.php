<?php
declare(strict_types=1);
require dirname(__DIR__) . '/public/api/instagram-common.php';

function check(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}
$image = [
    'id' => '1',
    'permalink' => 'https://www.instagram.com/p/example/',
    'media_url' => 'https://scontent.cdninstagram.com/example.jpg',
    'media_type' => 'IMAGE',
    'caption' => 'Çağla · Hello',
    'timestamp' => '2026-10-26T10:00:00+0000',
];
$video = array_replace($image, [
    'id' => '2',
    'media_type' => 'VIDEO',
    'media_url' => 'https://scontent.cdninstagram.com/video.mp4',
    'thumbnail_url' => 'https://scontent.cdninstagram.com/cover.jpg',
    'timestamp' => '2026-10-27T10:00:00+0000',
]);
$album = array_replace($image, ['id' => '3', 'media_type' => 'CAROUSEL_ALBUM']);
$posts = instagram_posts([
    $image,
    $video,
    $album,
    $image,
    array_replace($image, ['id' => '4', 'permalink' => 'https://evil.example/p/']),
    array_replace($image, ['id' => '5', 'timestamp' => 'not-a-date']),
    array_replace($image, ['id' => '6', 'media_url' => 'javascript:alert(1)']),
    array_replace($video, ['id' => '7', 'thumbnail_url' => '']),
]);
check(count($posts) === 3, 'Invalid entries or duplicates were not removed.');
check($posts[0]['id'] === '2', 'Posts must be sorted newest first.');
check($posts[0]['imageUrl'] === $video['thumbnail_url'], 'Videos must use their cover image.');
check($posts[1]['caption'] === 'Çağla · Hello', 'Captions must be preserved.');
check($posts[2]['mediaType'] === 'CAROUSEL_ALBUM', 'Albums must be supported.');
check(!array_key_exists('accessToken', $posts[0]), 'No token may be returned.');
$many = [];
for ($id = 10; $id < 30; $id++) {
    $many[] = array_replace($image, ['id' => (string) $id]);
}
check(count(instagram_posts($many)) === 6, 'Show no more than six posts.');
echo "Instagram normalization, sorting, deduplication, video covers and URL validation passed. No Meta requests made.\n";
