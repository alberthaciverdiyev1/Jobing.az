<?php

namespace App\Modules\Scraper\Models;

use Illuminate\Database\Eloquent\Model;

class ScraperSetting extends Model
{
    protected $guarded = ['id'];
    protected $casts = ['value' => 'array'];
}
