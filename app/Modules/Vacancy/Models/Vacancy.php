<?php

namespace App\Modules\Vacancy\Models;

use App\Modules\Application\Models\Application;
use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\Favorite\Models\Favorite;
use App\Modules\Core\Traits\HasSlug;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vacancy extends Model
{
    use HasFactory, HasSlug;

    protected string $slugSource = 'title';

    protected $fillable = [
        'company_id',
        'category_id',
        'city_id',
        'job_type_id',
        'workplace_type_id',
        'experience_level_id',
        'title',
        'slug',
        'salary_min',
        'salary_max',
        'salary_negotiable',
        'currency',
        'description',
        'requirements',
        'skills',
        'is_featured',
        'featured_until',
        'bumped_at',
        'is_active',
        'views_count',
        'deadline',
        'application_type',
        'application_email',
    ];

    protected $casts = [
        'skills' => 'array',
        'is_featured' => 'boolean',
        'featured_until' => 'datetime',
        'bumped_at' => 'datetime',
        'is_active' => 'boolean',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'salary_negotiable' => 'boolean',
        'views_count' => 'integer',
        'deadline' => 'date',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function jobType(): BelongsTo
    {
        return $this->belongsTo(JobType::class);
    }

    public function workplaceType(): BelongsTo
    {
        return $this->belongsTo(WorkplaceType::class);
    }

    public function experienceLevel(): BelongsTo
    {
        return $this->belongsTo(ExperienceLevel::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q) {
                $q->whereNull('deadline')->orWhere('deadline', '>=', now()->toDateString());
            });
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function getJobTypeNameAttribute(): string
    {
        $name = $this->jobType?->name;
        return is_array($name) ? ($name['az'] ?? reset($name)) : (string) ($name ?? '');
    }

    public function getWorkplaceTypeNameAttribute(): string
    {
        $name = $this->workplaceType?->name;
        return is_array($name) ? ($name['az'] ?? reset($name)) : (string) ($name ?? '');
    }

    public function getExperienceLevelNameAttribute(): string
    {
        $name = $this->experienceLevel?->name;
        return is_array($name) ? ($name['az'] ?? reset($name)) : (string) ($name ?? '');
    }

    public function getCityNameAttribute(): string
    {
        $name = $this->city?->name ?: $this->company?->city?->name;
        return is_array($name) ? ($name['az'] ?? reset($name)) : (string) ($name ?? '');
    }

    public function getFormattedSalaryAttribute(): string
    {
        if ($this->salary_negotiable) {
            return __('Razılaşma yolu ilə');
        }

        $symbol = match($this->currency) {
            'TRY' => '₺',
            'USD' => '$',
            'EUR' => '€',
            'AZN' => '₼',
            default => $this->currency,
        };

        if (!$this->salary_min && !$this->salary_max) {
            return __('Maaş göstərilməyib');
        }

        if ($this->salary_min && $this->salary_max) {
            return number_format($this->salary_min, 0, ',', '.') . ' - ' . number_format($this->salary_max, 0, ',', '.') . ' ' . $symbol;
        }

        if ($this->salary_min) {
            return number_format($this->salary_min, 0, ',', '.') . '+ ' . $symbol;
        }

        return __('qədər') . ' ' . number_format($this->salary_max, 0, ',', '.') . ' ' . $symbol;
    }
}
