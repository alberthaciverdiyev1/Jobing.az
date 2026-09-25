<?php

namespace App\Modules\Visitor\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorHit extends Model
{
    public $timestamps = false;

    protected $fillable = ['ip', 'user_agent', 'path', 'created_at'];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
