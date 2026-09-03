<?php

namespace App\Modules\Category\Models;

use App\Modules\Core\Traits\HasSlug;
use App\Modules\JobSeeker\Models\JobSeeker;
use App\Modules\Localization\Traits\HasTranslations;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory, HasSlug, HasTranslations;

    protected string $slugSource = 'name';

    public array $translatable = ['name'];

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'icon',
    ];

    protected $casts = [
        'name' => 'array',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('id');
    }

    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class);
    }

    public function jobSeekers(): HasMany
    {
        return $this->hasMany(JobSeeker::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(\App\Modules\JobAttribute\Models\Skill::class);
    }

    public function scopeParents(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function scopeSubcategories(Builder $query): Builder
    {
        return $query->whereNotNull('parent_id');
    }
}
