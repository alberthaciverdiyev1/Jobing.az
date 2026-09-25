<?php

namespace App\Modules\Vacancy\Models;

use App\Modules\Category\Models\Category;
use App\Modules\Core\Traits\HasSlug;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScrapedVacancy extends Model
{
    use HasSlug;

    protected string $slugSource = 'title';

    protected $guarded = ['id'];

    protected $casts = [
        'skills' => 'array',
        'application_fields' => 'array',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'salary_negotiable' => 'boolean',
        'is_featured' => 'boolean',
        'featured_until' => 'datetime',
        'is_active' => 'boolean',
        'deadline' => 'date',
        'views_count' => 'integer',
        'bumped_at' => 'datetime',
    ];

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

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q) {
                $q->whereNull('deadline')->orWhere('deadline', '>=', now()->toDateString());
            });
    }

    public function getJobTypeNameAttribute(): string
    {
        return (string) ($this->jobType?->name ?? '');
    }

    public function getWorkplaceTypeNameAttribute(): string
    {
        return (string) ($this->workplaceType?->name ?? '');
    }

    public function getExperienceLevelNameAttribute(): string
    {
        return (string) ($this->experienceLevel?->name ?? '');
    }

    public function getCityNameAttribute(): string
    {
        return (string) ($this->city?->name ?? '');
    }

    public function getSourceNameAttribute(): ?string
    {
        $host = parse_url((string) $this->redirect_url, PHP_URL_HOST);

        if (! $host) {
            return null;
        }

        return preg_replace('/^www\./i', '', $host) ?: null;
    }

    public function getFormattedSalaryAttribute(): string
    {
        $min = ((float) $this->salary_min) > 0 ? (float) $this->salary_min : null;
        $max = ((float) $this->salary_max) > 0 ? (float) $this->salary_max : null;

        if ($this->salary_negotiable || ($min === null && $max === null)) {
            return __('Negotiable');
        }

        $symbol = match ($this->currency) {
            'TRY' => '₺', 'USD' => '$', 'EUR' => '€', 'AZN' => '₼', default => $this->currency,
        };

        if ($min !== null && $max !== null) {
            if ($min === $max) {
                return number_format($min, 0, ',', '.') . ' ' . $symbol;
            }

            return number_format($min, 0, ',', '.') . ' - ' . number_format($max, 0, ',', '.') . ' ' . $symbol;
        }
        if ($min !== null) {
            return number_format($min, 0, ',', '.') . '+ ' . $symbol;
        }

        return __('up to') . ' ' . number_format($max, 0, ',', '.') . ' ' . $symbol;
    }
}
