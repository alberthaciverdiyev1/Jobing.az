<?php

namespace App\Modules\JobAttribute\Models;

use App\Modules\Category\Models\Category;
use App\Modules\Core\Traits\HasSlug;
use App\Modules\Localization\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Skill extends Model
{
    use HasFactory, HasSlug, HasTranslations;

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
}
