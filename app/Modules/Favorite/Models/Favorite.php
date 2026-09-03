<?php

namespace App\Modules\Favorite\Models;

use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    use HasFactory;

    protected $table = 'vacancy_favorites';

    protected $fillable = [
        'user_id',
        'vacancy_id',
    ];

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }
}
