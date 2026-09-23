<?php

namespace App\Modules\Scraper\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperSourceStatus extends Model
{
    protected $table = 'scraper_source_status';
    protected $guarded = ['id'];
    protected $casts = ['last_run_at' => 'datetime'];
}
