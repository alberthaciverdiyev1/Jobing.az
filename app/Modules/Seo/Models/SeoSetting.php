<?php

namespace App\Modules\Seo\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Qlobal SEO tənzimləmələri: <head>/<body>/<footer> RAW skriptlər,
 * standart meta məlumatlar (çoxdilli) və standart OG şəkli.
 */
class SeoSetting extends Model
{
    protected $table = 'seo_settings';

    protected $fillable = [
        'head_scripts',
        'body_scripts',
        'footer_scripts',
        'default_meta_title',
        'default_meta_description',
        'default_meta_keywords',
        'og_image',
    ];

    protected $casts = [
        'default_meta_title' => 'array',
        'default_meta_description' => 'array',
        'default_meta_keywords' => 'array',
    ];

    public const CACHE_KEY = 'seo_settings_singleton';

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
                'default_meta_title' => [
                    'az' => config('app.full_name') . ' — Modern İş Elanları və Karyera Platforması',
                    'tr' => config('app.full_name') . ' — Modern İş İlanları ve Kariyer Platforması',
                    'en' => config('app.full_name') . ' — Modern Job Board & Career Platform',
                    'ru' => config('app.full_name') . ' — Современная платформа вакансий и карьеры',
                ],
                'default_meta_description' => [
                    'az' => 'Yazılım, dizayn, məhsul, data və marketinq sahələrində açıq vakansiyalara ani müraciət edin.',
                    'tr' => 'Yazılım, tasarım, ürün, veri ve pazarlama alanlarında açık pozisyonlara anında başvurun.',
                    'en' => 'Apply instantly to open positions across software, design, product, data and marketing.',
                    'ru' => 'Мгновенно откликайтесь на открытые вакансии в сфере ПО, дизайна и данных.',
                ],
                'default_meta_keywords' => [
                    'az' => 'iş elanları, vakansiya, iş axtaran, kariyera, jobing',
                    'tr' => 'iş ilanları, vaka, iş arayan, kariyer, jobing',
                    'en' => 'job listings, vacancies, hiring, careers, jobing',
                    'ru' => 'вакансии, работа, резюме, карьера, jobing',
                ],
            ]);
        }

        Cache::put(self::CACHE_KEY, $setting, 86400);

        return static::$memoized = $setting;
    }

    public function getTrans(string $field, ?string $locale = null, string $default = ''): string
    {
        $locale = $locale ?: app()->getLocale();
        $values = $this->{$field};

        if (is_array($values)) {
            return $values[$locale] ?? $values['az'] ?? $values['tr'] ?? $values['en'] ?? reset($values) ?: $default;
        }

        return (string) ($values ?: $default);
    }
}
