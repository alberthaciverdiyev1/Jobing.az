<?php

namespace Modules\API\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'company_name',
        'image_url',
        'website',
        'company_id',
        'unique_key',
    ];
}
