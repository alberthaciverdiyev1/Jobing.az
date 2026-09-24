<?php

namespace App\Modules\Promotion\Models;

use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'vacancy_id', 'user_id', 'mode', 'times', 'price', 'phone', 'status', 'note', 'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'times' => 'integer',
        'price' => 'float',
    ];

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function approve(): void
    {
        $vacancy = $this->vacancy;

        if ($vacancy) {
            if ($this->mode === 'premium') {
                $vacancy->is_featured = true;
                $vacancy->featured_until = now()->addDays(30);
            } else {
                $vacancy->bumped_at = now();
            }
            $vacancy->save();
        }

        $this->update(['status' => 'approved', 'reviewed_at' => now()]);
    }

    public function reject(?string $note = null): void
    {
        $this->update(['status' => 'rejected', 'note' => $note ?: $this->note, 'reviewed_at' => now()]);
    }
}
