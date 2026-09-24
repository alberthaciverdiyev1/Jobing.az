<?php

namespace App\Modules\Seo\Models;

use App\Modules\Localization\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class PageSeo extends Model
{
    use HasFactory;

    protected $table = 'page_seos';

    public array $translatable = ['h1', 'title', 'description', 'keywords'];

    protected $fillable = [
        'page_key',
        'page_name',
        'route_name',
        'h1',
        'title',
        'description',
        'keywords',
        'canonical_url',
        'og_image',
        'sort_order',
    ];

    protected $casts = [
        'h1' => 'array',
        'title' => 'array',
        'description' => 'array',
        'keywords' => 'array',
    ];

    public const CACHE_KEY_ALL = 'page_seos_all';

    protected static ?array $memoizedAll = null;
    protected static ?self $memoizedCurrent = null;

    protected static function booted(): void
    {
        static::saved(function () {
            static::$memoizedAll = null;
            static::$memoizedCurrent = null;
            Cache::forget(self::CACHE_KEY_ALL);
        });

        static::deleted(function () {
            static::$memoizedAll = null;
            static::$memoizedCurrent = null;
            Cache::forget(self::CACHE_KEY_ALL);
        });
    }

    public static function allCached(): array
    {
        if (static::$memoizedAll !== null) {
            return static::$memoizedAll;
        }

        $cached = Cache::get(self::CACHE_KEY_ALL);
        if (is_array($cached) && !empty($cached) && reset($cached) instanceof self) {
            return static::$memoizedAll = $cached;
        }

        $all = self::orderBy('sort_order')->get()->keyBy('page_key')->all();
        if (empty($all)) {
            self::ensureDefaults();
            $all = self::orderBy('sort_order')->get()->keyBy('page_key')->all();
        }
        Cache::put(self::CACHE_KEY_ALL, $all, 86400);

        return static::$memoizedAll = $all;
    }

    /**
     * Resolve the PageSeo for the current route (by name or path prefix).
     */
    public static function findForCurrentRoute(?string $currentRoute = null): ?self
    {
        if ($currentRoute === null && static::$memoizedCurrent !== null) {
            return static::$memoizedCurrent;
        }

        $all = self::allCached();
        $routeName = $currentRoute ?: request()->route()?->getName();
        $path = trim(request()->path(), '/');

        // 1. Exact route-name match
        if ($routeName) {
            foreach ($all as $pageSeo) {
                if ($pageSeo->route_name === $routeName || $pageSeo->page_key === $routeName) {
                    return static::$memoizedCurrent = $pageSeo;
                }
            }
        }

        // 2. Path-based fallbacks
        if ($path === '' || $path === '/') {
            return static::$memoizedCurrent = ($all['home'] ?? null);
        }

        foreach ($all as $key => $pageSeo) {
            $prefix = (string) ($pageSeo->route_name ?: $key);
            if ($prefix && str_starts_with($path, $prefix)) {
                return static::$memoizedCurrent = $pageSeo;
            }
        }

        return null;
    }

    /**
     * Return a translated (or plain) field value.
     */
    public function getTrans(string $field, ?string $locale = null, string $default = ''): string
    {
        $locale = $locale ?: app()->getLocale();
        $values = $this->{$field};

        if (is_array($values)) {
            return (string) ($values[$locale] ?? $values['tr'] ?? $values['az'] ?? reset($values) ?: $default);
        }

        return (string) ($values ?: $default);
    }

    /**
     * Seed defaults for the main Kariyer.KibrisKare pages.
     */
    public static function ensureDefaults(): void
    {
        $defaults = [
            [
                'page_key' => 'home',
                'page_name' => 'Ana Sayfa',
                'route_name' => 'home',
                'sort_order' => 1,
                'title' => ['az' => 'Kariyer.KibrisKare — Modern İş Elanları və Karyera Platforması', 'tr' => 'Kariyer.KibrisKare — Modern İş İlanları ve Kariyer Platforması', 'en' => 'Kariyer.KibrisKare — Modern Job Board & Career Platform', 'ru' => 'Kariyer.KibrisKare — Современная платформа вакансий и карьеры'],
                'description' => ['az' => 'Yazılım, dizayn, məhsul, data və marketinq sahələrində açıq vakansiyalara ani müraciət edin.', 'tr' => 'Yazılım, tasarım, ürün, veri ve pazarlama alanlarında açık pozisyonlara anında başvurun.', 'en' => 'Apply instantly to open positions across software, design, product, data and marketing.', 'ru' => 'Мгновенно откликайтесь на открытые вакансии в сфере ПО, дизайна и данных.'],
            ],
            [
                'page_key' => 'jobs',
                'page_name' => 'İş İlanları',
                'route_name' => 'jobs.index',
                'sort_order' => 2,
                'title' => ['az' => 'İş İlanları — Kariyer.KibrisKare', 'tr' => 'İş İlanları — Kariyer.KibrisKare', 'en' => 'Job Vacancies — Kariyer.KibrisKare', 'ru' => 'Вакансии — Kariyer.KibrisKare'],
                'description' => ['az' => 'Bütün aktiv iş elanlarına baxın və filtrələyin.', 'tr' => 'Tüm aktif iş ilanlarını görüntüleyin ve filtreleyin.', 'en' => 'Browse and filter all active job vacancies.', 'ru' => 'Просматривайте и фильтруйте все активные вакансии.'],
            ],
            [
                'page_key' => 'companies',
                'page_name' => 'Şirketler',
                'route_name' => 'companies.index',
                'sort_order' => 3,
                'title' => ['az' => 'Şirkətlər — Kariyer.KibrisKare', 'tr' => 'Şirketler — Kariyer.KibrisKare', 'en' => 'Companies — Kariyer.KibrisKare', 'ru' => 'Компании — Kariyer.KibrisKare'],
                'description' => ['az' => 'İşə götürən şirkətlərin kataloquna baxın.', 'tr' => 'İş veren şirketlerin kataloğunu görüntüleyin.', 'en' => 'Browse the catalog of hiring companies.', 'ru' => 'Каталог нанимающих компаний.'],
            ],
            [
                'page_key' => 'job_seekers',
                'page_name' => __('Job Seeking'),
                'route_name' => 'job-seekers.index',
                'sort_order' => 4,
                'title' => ['az' => 'İş Axtarıram — Kariyer.KibrisKare', 'tr' => 'İş Arıyorum — Kariyer.KibrisKare', 'en' => 'I Am Looking for Work — Kariyer.KibrisKare', 'ru' => 'Ищу работу — Kariyer.KibrisKare'],
                'description' => ['az' => 'İş axtaranların elanlarına baxın və namizədlərlə əlaqə saxlayın.', 'tr' => 'İş arayanların ilanlarına göz atın ve adaylarla iletişime geçin.', 'en' => 'Browse job-seeker listings and contact candidates.', 'ru' => 'Объявления соискателей работы.'],
            ],
            [
                'page_key' => 'blog',
                'page_name' => 'Kariyer Bloğu',
                'route_name' => 'blog.index',
                'sort_order' => 5,
                'title' => ['az' => 'Karyera Bloğu — Kariyer.KibrisKare', 'tr' => 'Kariyer Bloğu — Kariyer.KibrisKare', 'en' => 'Career Blog — Kariyer.KibrisKare', 'ru' => 'Карьерный блог — Kariyer.KibrisKare'],
                'description' => ['az' => 'İş axtarışı, CV və mülakat məsləhətləri.', 'tr' => 'İş arama, CV ve mülakat ipuçları.', 'en' => 'Job search, CV and interview tips.', 'ru' => 'Советы по поиску работы и собеседованиям.'],
            ],
            [
                'page_key' => 'faq',
                'page_name' => __('Frequently Asked Questions'),
                'route_name' => 'faq.index',
                'sort_order' => 6,
                'title' => ['az' => 'Tez-tez Verilən Suallar — Kariyer.KibrisKare', 'tr' => 'Sıkça Sorulan Sorular — Kariyer.KibrisKare', 'en' => 'FAQ — Kariyer.KibrisKare', 'ru' => 'Часто задаваемые вопросы — Kariyer.KibrisKare'],
                'description' => ['az' => 'İş axtarışı və vakansiya prosesləri haqqında suallar.', 'tr' => 'İş arama ve vakansiya süreçleri hakkında sorular.', 'en' => 'Questions about job search and hiring.', 'ru' => 'Вопросы о поиске работы.'],
            ],
            [
                'page_key' => 'contact',
                'page_name' => 'İletişim',
                'route_name' => 'contact.index',
                'sort_order' => 7,
                'title' => ['az' => 'Əlaqə — Kariyer.KibrisKare', 'tr' => 'İletişim — Kariyer.KibrisKare', 'en' => 'Contact — Kariyer.KibrisKare', 'ru' => 'Контакты — Kariyer.KibrisKare'],
                'description' => ['az' => 'Kariyer.KibrisKare ilə əlaqə saxlayın.', 'tr' => 'Kariyer.KibrisKare ile iletişime geçin.', 'en' => 'Get in touch with Kariyer.KibrisKare.', 'ru' => 'Свяжитесь с Kariyer.KibrisKare.'],
            ],
        ];

        foreach ($defaults as $pageData) {
            self::firstOrCreate(['page_key' => $pageData['page_key']], $pageData);
        }
    }
}
