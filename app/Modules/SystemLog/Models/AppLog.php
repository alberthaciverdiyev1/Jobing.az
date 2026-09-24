<?php

namespace App\Modules\SystemLog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppLog extends Model
{
    use HasFactory;

    protected $connection = 'logs';

    protected $table = 'app_logs';

    protected $fillable = [
        'level', 'source', 'message', 'metadata', 'url', 'method', 'ip',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
