<?php

namespace Modules\API\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogImage extends Model
{
    use HasFactory,SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'blog_id',
        'image',
    ];

    /**
     * Relation: BlogImage belongs to Blog
     */
    public function blog()
    {
        return $this->belongsTo(Blog::class, 'blog_id');
    }
}
