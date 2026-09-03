<?php

namespace App\Modules\Inquiry\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inquiry extends Model
{
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::created(function (Inquiry $inquiry) {
            try {
                app(\App\Modules\Core\Services\TelegramService::class)->sendNewLead($inquiry);
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'type',
        'status',
        'notes',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeNew(Builder $query): Builder
    {
        return $query->whereIn('status', ['new', 'contacted']);
    }
}
