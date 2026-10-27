<?php
// Copy to server/medeina-instagram-config.php locally.
// On hosting, keep the real configuration OUTSIDE the public website directory.
return [
    'accessToken' => '',
    // instagram = Instagram Login; facebook = Facebook Login / Graph API Explorer.
    'login' => 'instagram',
    // Instagram Login can use 'me'. Facebook Login requires the Instagram user ID,
    // NOT the Facebook page ID. Never use the access token as the user ID.
    'userId' => 'me',
    'apiVersion' => 'v25.0',
    'username' => 'medeinaland',
];
