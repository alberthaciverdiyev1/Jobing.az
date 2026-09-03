<?php

namespace App\Modules\Setting\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Singleton row (id = 1) holding site-wide settings.
 * Access via SiteSetting::current() (memoized + cached).
 */
class SiteSetting extends Model
{
    protected $table = 'site_settings';

    public const CACHE_KEY = 'site_settings_singleton';

    protected $fillable = [
        'email',
        'support_email',
        'phone',
        'phone_secondary',
        'whatsapp',
        'address',
        'working_hours',
        'tagline',
        'footer_description',
        'copyright_text',
        'facebook_url',
        'instagram_url',
        'linkedin_url',
        'telegram_url',
        'twitter_url',
        'youtube_url',
    ];

    protected $casts = [
        'address' => 'array',
        'tagline' => 'array',
        'footer_description' => 'array',
    ];

    protected static ?self $memoized = null;

    protected static function booted(): void
    {
        static::saved(function () {
            static::$memoized = null;
            Cache::forget(self::CACHE_KEY);
        });

        static::deleted(function () {
            static::$memoized = null;
            Cache::forget(self::CACHE_KEY);
        });
    }

    public static function current(): self
    {
        if (static::$memoized !== null) {
            return static::$memoized;
        }

        $cached = Cache::get(self::CACHE_KEY);
        if ($cached instanceof self) {
            return static::$memoized = $cached;
        }

        $setting = self::find(1);
        if (! $setting) {
            $setting = self::create([
                'id' => 1,
                'email' => 'info@jobing.az',
                'support_email' => 'support@jobing.az',
                'phone' => '+994 00 000 00 00',
                'working_hours' => 'Mon – Fri · 09:00 – 18:00',
                'tagline' => [
                    'az' => 'Modern iş elanları və karyera platforması',
                    'tr' => 'Modern iş ilanları ve kariyer platforması',
                    'en' => 'Modern job board & career platform',
                    'ru' => 'Современная платформа вакансий и карьеры',
                ],
                'footer_description' => [
                    'az' => 'Yazılım, dizayn, məhsul, data və marketinq sahələrində aparıcı şirkətlərin açıq vəzifələrinə ani müraciət edin.',
                    'tr' => 'Yazılım, tasarım, ürün, veri ve pazarlama alanlarında önde gelen şirketlerin açık pozisyonlarına anında başvurun.',
                    'en' => 'Apply instantly to open positions at leading companies across software, design, product, data and marketing.',
                    'ru' => 'Мгновенно откликайтесь на открытые вакансии ведущих компаний в сфере ПО, дизайна, продукта, данных и маркетинга.',
                ],
                'address' => [
                    'az' => 'Bakı, Azərbaycan',
                    'tr' => 'Bakü, Azerbaycan',
                    'en' => 'Baku, Azerbaijan',
                    'ru' => 'Баку, Азербайджан',
                ],
                'copyright_text' => 'Jobing.az',
            ]);
        }

        Cache::put(self::CACHE_KEY, $setting, 86400);

        return static::$memoized = $setting;
    }

    /**
     * Return a translated (or plain) field value.
     */
    public function getTrans(string $field, ?string $locale = null, string $default = ''): string
    {
        $locale = $locale ?: app()->getLocale();
        $values = $this->{$field};

        if (is_array($values)) {
            return (string) ($values[$locale] ?? $values['az'] ?? reset($values) ?: $default);
        }

        return (string) ($values ?: $default);
    }
}
