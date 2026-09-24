<?php

return [

    /*
    |--------------------------------------------------------------------------
    | WhatsApp Fallback
    |--------------------------------------------------------------------------
    | SiteSetting'te whatsapp tanımlı değilse kullanılacak varsayılan numara.
    |
    */

    'whatsapp_fallback' => env('SITE_WHATSAPP_FALLBACK', '905000000000'),

    
    'social_fallbacks' => [
        'facebook_url' => env('SITE_FACEBOOK_URL'),
        'instagram_url' => env('SITE_INSTAGRAM_URL'),
        'linkedin_url' => env('SITE_LINKEDIN_URL'),
        'telegram_url' => env('SITE_TELEGRAM_URL'),
        'twitter_url' => env('SITE_TWITTER_URL'),
        'youtube_url' => env('SITE_YOUTUBE_URL'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Remote Workplace Slugs
    |--------------------------------------------------------------------------
    | "Remote/Uzaktan" kabul edilen çalışma yeri slug'ları. İstatistik
    | (remote ilan sayısı) bu listeye göre hesaplanır; veride değişirse
    | buradan güncellenir — blade/servis içinde sabit string aranmaz.
    |
    */

    'remote_workplace_slugs' => ['uzaktan', 'remote'],

    /*
    |--------------------------------------------------------------------------
    | Promotion Pricing (bump & premium)
    |--------------------------------------------------------------------------
    | Promosyon paket fiyatları (₺) blade yerine config'de tutulur.
    | Anahtar = "kaç kez" (1/3/7), değer = fiyat.
    |
    */

    'promotions' => [
        'bump' => [
            'prices' => [1 => 100, 3 => 250, 7 => 500],
        ],
        'premium' => [
            'prices' => [1 => 150, 3 => 350, 7 => 700],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Panel URLs
    |--------------------------------------------------------------------------
    | Rol bazlı panel yolları (admin / company / user) tek noktadan.
    |
    */

    'panels' => [
        'admin' => '/admin',
        'company' => '/company',
        'user' => '/user',
    ],
];
