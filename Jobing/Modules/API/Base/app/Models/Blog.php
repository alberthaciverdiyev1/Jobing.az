<?php

namespace Base\app\Models;

use Base\app\Models\BlogImage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory,SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'slug',
        'az_title',
        'ru_title',
        'en_title',
        'az_content',
        'ru_content',
        'en_content',
        'main_image',
        'is_active',
        'show_in_home_page',
    ];

    public function images()
    {
        return $this->hasMany(BlogImage::class, 'blog_id');
    }

}
