<?php

namespace App\Modules\ActivityLog\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GeoIpService
{
    /** IP üçün geo məlumat (30 gün keşlənir). */
    public static function resolve(?string $ip, ?string $cfCountry = null): array
    {
        if (empty($ip) || in_array($ip, ['127.0.0.1', '::1'], true)
            || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')
            || str_starts_with($ip, '172.16.')) {
            return [
                'country_code' => $cfCountry ?: 'LOC',
                'country_name' => $cfCountry ? self::countryNameFromCode($cfCountry) : 'Lokal Şəbəkə',
                'city' => 'Lokal',
                'region' => '',
                'latitude' => 40.4093,
                'longitude' => 49.8671,
                'isp' => 'Internal / Localhost',
            ];
        }

        return Cache::remember('geoip_' . md5($ip), 86400 * 30, function () use ($ip, $cfCountry) {
            try {
                $res = Http::timeout(2)->get("http://ip-api.com/json/{$ip}?fields=status,country,countryCode,regionName,city,lat,lon,isp");
                if ($res->successful() && $res->json('status') === 'success') {
                    $d = $res->json();
                    return [
                        'country_code' => strtoupper($d['countryCode'] ?? $cfCountry ?? 'XX'),
                        'country_name' => $d['country'] ?? self::countryNameFromCode($cfCountry),
                        'city' => $d['city'] ?? 'Naməlum',
                        'region' => $d['regionName'] ?? '',
                        'latitude' => isset($d['lat']) ? (float) $d['lat'] : null,
                        'longitude' => isset($d['lon']) ? (float) $d['lon'] : null,
                        'isp' => $d['isp'] ?? '',
                    ];
                }
            } catch (\Throwable $e) {
            }

            return [
                'country_code' => strtoupper($cfCountry ?? 'XX'),
                'country_name' => self::countryNameFromCode($cfCountry),
                'city' => 'Naməlum',
                'region' => '',
                'latitude' => null,
                'longitude' => null,
                'isp' => '',
            ];
        });
    }

    /** User-Agent-dən cihaz / brauzer / OS çıxarır. */
    public static function parseUserAgent(?string $ua): array
    {
        $ua = strtolower((string) $ua);

        if (str_contains($ua, 'ipad') || str_contains($ua, 'tablet')) {
            $device = 'tablet';
        } elseif (str_contains($ua, 'mobile') || str_contains($ua, 'android') || str_contains($ua, 'iphone')) {
            $device = 'mobile';
        } elseif ($ua === '') {
            $device = 'unknown';
        } else {
            $device = 'desktop';
        }

        $browser = 'unknown';
        foreach (['edg' => 'Edge', 'opr/' => 'Opera', 'chrome' => 'Chrome', 'firefox' => 'Firefox', 'safari' => 'Safari'] as $needle => $name) {
            if (str_contains($ua, $needle)) { $browser = $name; break; }
        }

        $os = 'unknown';
        foreach (['windows' => 'Windows', 'android' => 'Android', 'iphone' => 'iOS', 'ipad' => 'iPadOS', 'mac os' => 'macOS', 'linux' => 'Linux'] as $needle => $name) {
            if (str_contains($ua, $needle)) { $os = $name; break; }
        }

        return ['device_type' => $device, 'browser' => $browser, 'os' => $os];
    }

    public static function flagEmoji(?string $code): string
    {
        $code = strtoupper((string) $code);
        if (strlen($code) !== 2 || $code === 'XX' || $code === 'LOC') {
            return $code === 'LOC' ? '🏠' : '🌐';
        }

        return mb_chr(0x1F1E6 + ord($code[0]) - 65) . mb_chr(0x1F1E6 + ord($code[1]) - 65);
    }

    public static function countryNameFromCode(?string $code): string
    {
        $code = strtoupper((string) $code);
        $map = [
            'AZ' => 'Azərbaycan', 'TR' => 'Türkiyə', 'RU' => 'Rusiya', 'US' => 'ABŞ',
            'GB' => 'Böyük Britaniya', 'DE' => 'Almaniya', 'FR' => 'Fransa', 'UA' => 'Ukrayna',
            'IR' => 'İran', 'GE' => 'Gürcüstan', 'KZ' => 'Qazaxıstan', 'NL' => 'Hollandiya',
        ];

        return $map[$code] ?? ($code ?: 'Naməlum');
    }
}
