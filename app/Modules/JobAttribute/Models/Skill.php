<?php

namespace App\Modules\JobAttribute\Models;

use App\Modules\Category\Models\Category;
use App\Modules\Core\Traits\HasSlug;
use App\Modules\Localization\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Core\Traits\ClearsCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Skill extends Model
{
    use HasFactory, HasSlug, HasTranslations, ClearsCache;

    public array $translatable = ['name'];

    protected string $slugSource = 'name';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'order',
        'is_active',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'name' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('order')->orderBy('id');
    }
    public const CACHE_KEY = 'ref.skills.active';

    public static function cacheKeys(): array
    {
        return [self::CACHE_KEY, 'ref.skills.popular'];
    }

    /** Aktiv bacarıqlar, adla sıralı (keşlənmiş). */
    public static function cachedActive(): \Illuminate\Database\Eloquent\Collection
    {
        return static::remember(self::CACHE_KEY, fn () => static::active()->get()->sortBy('name')->values());
    }
}
