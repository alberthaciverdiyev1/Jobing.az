<?php

namespace App\Modules\Scraper\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperSourceRun extends Model
{
    protected $guarded = ['id'];
    protected $casts = ['run_at' => 'datetime'];
}
