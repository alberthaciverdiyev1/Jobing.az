<?php

namespace App\Modules\Story\Models;

use App\Models\User;
use App\Modules\Company\Models\Company;
use App\Modules\Story\Services\StoryMediaProcessor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class Story extends Model
{
    use HasFactory;

    public const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'];

    protected $fillable = [
        'user_id',
        'company_id',
        'media_path',
        'media_type',
        'thumbnail_path',
        'link_url',
        'is_active',
        'expires_at',
        'media_processed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'media_processed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (Story $story): void {
            if ($story->media_path) {
                $extension = strtolower(pathinfo($story->media_path, PATHINFO_EXTENSION));
                $story->media_type = in_array($extension, self::VIDEO_EXTENSIONS, true) ? 'video' : 'image';
            }

            if ($story->isDirty('media_path')) {
                $story->media_processed_at = null;
            }
        });

        static::saved(function (Story $story): void {
            static::flushBarCache();

            if (
                $story->media_type === 'video'
                && $story->media_processed_at === null
                && $story->media_path
            ) {
                app(StoryMediaProcessor::class)->process($story);
            }
        });

        static::deleted(function (Story $story): void {
            static::flushBarCache();

            $disk = Storage::disk('public');

            foreach ([$story->media_path, $story->thumbnail_path] as $path) {
                if ($path) {
                    $disk->delete($path);
                }
            }
        });
    }

    protected static function flushBarCache(): void
    {
        foreach (array_keys(config('app.available_locales', [])) as $locale) {
            Cache::forget('stories.bar.'.$locale);
        }
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $query): void {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(StoryView::class);
    }

    public function isVideo(): bool
    {
        return $this->media_type === 'video';
    }

    public function getMediaUrlAttribute(): string
    {
        return asset('storage/'.ltrim((string) $this->media_path, '/'));
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->thumbnail_path
            ? asset('storage/'.ltrim($this->thumbnail_path, '/'))
            : null;
    }

    public function getOwnerNameAttribute(): string
    {
        return $this->company?->name
            ?: $this->user?->name
            ?: config('app.full_name', 'Jobing');
    }

    public function getOwnerAvatarAttribute(): ?string
    {
        return $this->company?->logo
            ? asset('storage/'.ltrim($this->company->logo, '/'))
            : null;
    }

    public function getOwnerInitialAttribute(): string
    {
        return mb_strtoupper(mb_substr($this->owner_name, 0, 1));
    }

    public function isViewedBy(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->views()->where('user_id', $user->id)->exists();
    }
}
