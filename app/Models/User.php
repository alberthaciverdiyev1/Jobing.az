<?php

namespace App\Models;

use App\Modules\Application\Models\Application;
use App\Modules\Company\Models\Company;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable;

    protected static array $appliedVacancyIdsMemo = [];

    public function canAccessPanel(Panel $panel): bool
    {
        if ((bool) $this->is_admin) {
            return true;
        }

        return match ($panel->getId()) {
            'company' => $this->isCompany(),
            'user' => !$this->isCompany(),
            default => false,
        };
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'company_id',
        'user_type',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function isCompany(): bool
    {
        return ($this->user_type ?? 'user') === 'company';
    }

    public function isUser(): bool
    {
        return !$this->isCompany() && !$this->is_admin;
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function panelPath(): string
    {
        if ($this->is_admin) {
            return config('site.panels.admin');
        }

        return $this->isCompany()
            ? config('site.panels.company')
            : config('site.panels.user');
    }

    public function appliedVacancyIds(): array
    {
        if (! array_key_exists($this->id, static::$appliedVacancyIdsMemo)) {
            static::$appliedVacancyIdsMemo[$this->id] = $this->applications()
                ->pluck('vacancy_id')
                ->all();
        }

        return static::$appliedVacancyIdsMemo[$this->id];
    }

    public static function flushAppliedVacancyCache(?int $userId): void
    {
        if ($userId !== null) {
            unset(static::$appliedVacancyIdsMemo[$userId]);
        }
    }

    public function resumes(): HasMany
    {
        return $this->hasMany(\App\Modules\Resume\Models\Resume::class);
    }
}
