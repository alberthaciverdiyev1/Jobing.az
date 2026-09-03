<?php

return [

    /*
    |--------------------------------------------------------------------------
    | WhatsApp Fallback
    |--------------------------------------------------------------------------
    | SiteSetting'te whatsapp tanımlı değilse kullanılacak varsayılan numara.
    |
    */

    'whatsapp_fallback' => env('SITE_WHATSAPP_FALLBACK', '994500000000'),

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
    | Promosyon paket fiyatları (₼) blade yerine config'de tutulur.
    | Anahtar = "kaç kez" (1/3/7), değer = fiyat.
    |
    */

    'promotions' => [
        'bump' => [
            'prices' => [1 => 5, 3 => 12, 7 => 25],
        ],
        'premium' => [
            'prices' => [1 => 7, 3 => 18, 7 => 35],
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
