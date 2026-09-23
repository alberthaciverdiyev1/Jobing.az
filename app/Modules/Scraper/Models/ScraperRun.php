<?php

namespace App\Modules\Scraper\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperRun extends Model
{
    protected $guarded = ['id'];
    protected $casts = ['started_at' => 'datetime', 'finished_at' => 'datetime'];
}
