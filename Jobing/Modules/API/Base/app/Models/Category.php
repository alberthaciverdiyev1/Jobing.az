<?php

namespace Base\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory,SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'local_category_id',
        'category_name',
        'smart_job_az',
        'offer_az',
        'job_search',
        'boss_az',
        'hello_job_az',
    ];

    public function vacancies(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
