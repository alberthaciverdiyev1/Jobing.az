<?php

namespace App\Modules\Company\Models;

use App\Models\User;
use App\Modules\Core\Traits\HasSlug;
use App\Modules\JobAttribute\Models\City;
use App\Modules\Localization\Traits\HasTranslations;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory, HasSlug, HasTranslations;

    protected string $slugSource = 'name';

    public array $translatable = ['about'];

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'banner',
        'website',
        'email',
        'phone',
        'city_id',
        'about',
        'is_verified',
        'verification_requested',
    ];

    protected $casts = [
        'about' => 'array',
        'is_verified' => 'boolean',
        'verification_requested' => 'boolean',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function getCityNameAttribute(): string
    {
        $name = $this->city?->name;
        return is_array($name) ? ($name['az'] ?? reset($name)) : (string) ($name ?? '');
    }

    /**
     * Determine whether the company has a real public profile
     * (registered user account, verified, logo, or about description),
     * rather than just an ad-hoc name entered during unauthenticated job posting.
     */
    public function hasPublicProfile(): bool
    {
        return $this->users()->exists()
            || $this->is_verified
            || !empty($this->logo)
            || !empty($this->about);
    }

    public function scopePublicProfile(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where(function (\Illuminate\Database\Eloquent\Builder $q) {
            $q->has('users')
                ->orWhere('is_verified', true)
                ->orWhereNotNull('logo')
                ->orWhereNotNull('about');
        });
    }
}
