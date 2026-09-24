<?php

return [


    'name' => env('APP_NAME', 'Jobing'),


    'brand_name' => env('APP_NAME', 'Jobing'),
    'brand_suffix' => env('APP_SUFFIX', '.az'),
    'full_name' => trim(env('APP_NAME', 'Jobing')) . env('APP_SUFFIX', '.az'),


    'env' => env('APP_ENV', 'production'),


    'debug' => (bool) env('APP_DEBUG', false),


    'url' => env('APP_URL', 'http://localhost'),


    'timezone' => 'UTC',


    'locale' => env('APP_LOCALE', 'az'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'az'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'az_AZ'),

    'available_locales' => [
        'az' => ['name' => 'Azərbaycan', 'flag' => '🇦🇿', 'code' => 'AZ'],
        'en' => ['name' => 'English', 'flag' => '🇬🇧', 'code' => 'EN'],
        'ru' => ['name' => 'Русский', 'flag' => '🇷🇺', 'code' => 'RU'],
        'tr' => ['name' => 'Türkçe', 'flag' => '🇹🇷', 'code' => 'TR'],
    ],


    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', (string) env('APP_PREVIOUS_KEYS', ''))
        ),
    ],


    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
