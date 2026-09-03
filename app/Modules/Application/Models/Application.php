<?php

namespace App\Modules\Application\Models;

use App\Models\User;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::observe(\App\Modules\Application\Observers\ApplicationObserver::class);

        static::created(function (Application $application) {
            try {
                app(\App\Modules\Core\Services\TelegramService::class)->sendNewApplication($application);
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    protected $fillable = [
        'vacancy_id',
        'user_id',
        'resume_id',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'resume_path',
        'cover_letter',
        'portfolio_url',
        'linkedin_url',
        'status',
        'viewed_at',
        'notes',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resume(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Resume\Models\Resume::class);
    }
}
