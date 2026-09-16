<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * appliedVacancyIds() için istek-içi memoize.
     * Octane/uzun ömürlü worker'larda bayat kalmaması için yeni başvuru
     * oluşturulduğunda flushAppliedVacancyCache() çağrılmalıdır.
     *
     * @var array<int, array<int, int>>
     */
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

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'company_id',
        'user_type',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The company this user is linked to (if registered as a company).
     */
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

    /**
     * Kullanıcı rolüne göre panel yolunu config'ten döner.
     */
    public function panelPath(): string
    {
        if ($this->is_admin) {
            return config('site.panels.admin');
        }

        return $this->isCompany()
            ? config('site.panels.company')
            : config('site.panels.user');
    }

    /**
     * Başvurulan ilan ID'lerini tek sorguyla döner ve istek boyunca cache'ler.
     * Liste sayfalarında kart başına N+1 sorguyu önler (blade içinde sorgu yazılmaz).
     *
     * @return array<int, int>
     */
    public function appliedVacancyIds(): array
    {
        if (! array_key_exists($this->id, static::$appliedVacancyIdsMemo)) {
            static::$appliedVacancyIdsMemo[$this->id] = $this->applications()
                ->pluck('vacancy_id')
                ->all();
        }

        return static::$appliedVacancyIdsMemo[$this->id];
    }

    /**
     * Bir kullanıcının başvuru memoize'ini boşaltır.
     * Yeni başvuru eklendiğinde çağrılır (bkz. Application::created).
     */
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
