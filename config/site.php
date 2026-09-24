<?php

return [


    'whatsapp_fallback' => env('SITE_WHATSAPP_FALLBACK', '994500000000'),

    'social_fallbacks' => [
        'facebook_url' => env('SITE_FACEBOOK_URL', 'https://www.facebook.com/profile.php?id=61569206672024'),
        'instagram_url' => env('SITE_INSTAGRAM_URL', 'https://www.instagram.com/jobing.az/'),
        'linkedin_url' => env('SITE_LINKEDIN_URL', 'https://www.linkedin.com/company/jobing-az/'),
        'telegram_url' => env('SITE_TELEGRAM_URL'),
        'twitter_url' => env('SITE_TWITTER_URL'),
        'youtube_url' => env('SITE_YOUTUBE_URL'),
    ],


    'remote_workplace_slugs' => ['uzaktan', 'remote'],


    'promotions' => [
        'bump' => [
            'prices' => [1 => 5, 3 => 12, 7 => 25],
        ],
        'premium' => [
            'prices' => [1 => 7, 3 => 18, 7 => 35],
        ],
    ],


    'panels' => [
        'admin' => '/admin',
        'company' => '/company',
        'user' => '/user',
    ],
];
