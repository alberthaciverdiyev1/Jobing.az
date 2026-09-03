<?php

namespace App\Modules\JobSeeker\Models;

use App\Modules\Category\Models\Category;
use App\Modules\Core\Traits\HasSlug;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobSeeker extends Model
{
    use HasFactory, HasSlug, SoftDeletes;

    protected static function booted(): void
    {
        static::created(function (JobSeeker $jobSeeker) {
            try {
                app(\App\Modules\Core\Services\TelegramService::class)->sendNewJobSeeker($jobSeeker);
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    protected string $slugSource = 'title';

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'position',
        'category_id',
        'job_type_id',
        'workplace_type_id',
        'experience_level_id',
        'skills',
        'salary_min',
        'salary_max',
        'salary_negotiable',
        'currency',
        'location',
        'availability',
        'contact_name',
        'contact_email',
        'contact_phone',
        'status',
        'is_featured',
        'bumped_at',
        'featured_until',
        'views_count',
    ];

    protected $casts = [
        'skills' => 'array',
        'is_featured' => 'boolean',
        'bumped_at' => 'datetime',
        'featured_until' => 'datetime',
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
        'salary_negotiable' => 'boolean',
        'views_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
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

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function getFormattedSalaryAttribute(): string
    {
        if ($this->salary_negotiable) {
            return __('Razılaşma yolu ilə');
        }

        $symbol = match ($this->currency) {
            'TRY' => '₺',
            'USD' => '$',
            'EUR' => '€',
            'AZN' => '₼',
            default => $this->currency,
        };

        if (!$this->salary_min && !$this->salary_max) {
            return __('Göstərilməyib');
        }

        if ($this->salary_min && $this->salary_max) {
            return number_format($this->salary_min, 0, ',', '.') . ' - ' . number_format($this->salary_max, 0, ',', '.') . ' ' . $symbol;
        }

        if ($this->salary_min) {
            return number_format($this->salary_min, 0, ',', '.') . '+ ' . $symbol;
        }

        return __('qədər') . ' ' . number_format($this->salary_max, 0, ',', '.') . ' ' . $symbol;
    }

    public function getAvailabilityLabelAttribute(): string
    {
        return match ($this->availability) {
            'immediate' => __('Dərhal başlaya bilər'),
            'two_weeks' => __('2 həftə içində'),
            'one_month' => __('1 ay içində'),
            'flexible' => __('Esnek'),
            default => __('Esnek'),
        };
    }
}
