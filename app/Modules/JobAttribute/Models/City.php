<?php

namespace App\Modules\JobAttribute\Models;

use App\Modules\Core\Traits\HasSlug;
use App\Modules\Localization\Traits\HasTranslations;
use App\Modules\Vacancy\Models\ScrapedVacancy;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Core\Traits\ClearsCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory, HasSlug, HasTranslations, ClearsCache;

    protected string $slugSource = 'name';

    public array $translatable = ['name'];

    protected $fillable = [
        'name',
        'slug',
        'order',
        'is_active',
    ];

    protected $casts = [
        'name' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class);
    }

    public function scrapedVacancies(): HasMany
    {
        return $this->hasMany(ScrapedVacancy::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('order')->orderBy('id');
    }
    public const CACHE_KEY = 'ref.cities.active';

    public static function cacheKeys(): array
    {
        return [self::CACHE_KEY];
    }

    public static function cachedActive(): \Illuminate\Database\Eloquent\Collection
    {
        return static::remember(self::CACHE_KEY, fn () => static::active()->get());
    }
}
