<?php

namespace App\Modules\News\Models;

use App\Modules\Core\Traits\HasSlug;
use App\Modules\Localization\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory, HasSlug, HasTranslations;

    protected $table = 'news';

    protected string $slugSource = 'title';

    public array $translatable = ['title', 'description', 'content'];

    protected $fillable = [
        'title', 'slug', 'category', 'image_url', 'description', 'content',
        'views', 'source_name', 'source_url', 'is_active', 'published_at',
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'content' => 'array',
        'views' => 'integer',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at');
    }

    public function getDateTextAttribute(): string
    {
        return $this->published_at?->translatedFormat('d M Y') ?? '';
    }
}
