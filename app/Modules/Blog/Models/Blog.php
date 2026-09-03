<?php

namespace App\Modules\Blog\Models;

use App\Modules\Core\Traits\HasSlug;
use App\Modules\Localization\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory, HasSlug, HasTranslations;

    protected string $slugSource = 'title';

    public array $translatable = ['title', 'excerpt', 'content'];

    protected $fillable = [
        'title',
        'slug',
        'category',
        'cover_image',
        'excerpt',
        'content',
        'views_count',
        'is_active',
        'published_at',
    ];

    protected $casts = [
        'title' => 'array',
        'excerpt' => 'array',
        'content' => 'array',
        'views_count' => 'integer',
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

    public function getFormattedDateAttribute(): string
    {
        return $this->published_at?->format('d M Y') ?? '';
    }

    public function getReadingTimeAttribute(): int
    {
        $text = strip_tags((string) $this->getTranslation('content'));
        return (int) max(1, round(mb_strlen($text) / 1000));
    }
}
