<?php

namespace App\Modules\Visitor\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/** IP bazlı təkrar olmayan ziyarətçi analitikası. */
class Visitor extends Model
{
    use HasFactory;

    protected $fillable = ['ip', 'user_agent', 'visit_count', 'last_visit'];

    protected $casts = [
        'visit_count' => 'integer',
        'last_visit' => 'datetime',
    ];
}
