<?php

namespace App\Modules\News\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RssSource extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'url', 'category', 'is_active', 'last_fetched_at'];

    protected $casts = [
        'is_active' => 'boolean',
        'last_fetched_at' => 'datetime',
    ];
}
