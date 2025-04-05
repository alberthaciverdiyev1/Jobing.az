<?php

namespace Modules\API\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'website',
        'city_id',
    ];

    public function jobs(): HasMany{
        return $this->hasMany(Job::class);
    }
}
