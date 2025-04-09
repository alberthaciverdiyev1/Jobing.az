<?php

namespace Base\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Visitor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'ip',
        'last_visit',
        'visit_count',
        'user_agent',
        'deleted_at',
    ];

    /**
     * Specify if the model should be timestamped.
     */
    public $timestamps = true;

    /**
     * The date format that should be used for database columns.
     */
    protected $dateFormat = 'Y-m-d H:i:s';
}
