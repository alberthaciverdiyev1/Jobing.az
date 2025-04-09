<?php

namespace Base\app\Models;

use Base\app\Models\Category;
use Base\app\Models\City;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vacancy extends Model
{
    use HasFactory,SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'unique_key',
        'slug',
        'title',
        'email',
        'phone',
        'description',
        'location',
        'min_salary',
        'max_salary',
        'min_age',
        'max_age',
        'currency_sign',
        'category_id',
        'sub_category_id',
        'company_name',
        'company_id',
        'city_id',
        'education_id',
        'experience_id',
        'user_name',
        'is_premium',
        'is_active',
        'job_type',
        'posted_at',
        'source_url',
        'redirect_url',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }


}
