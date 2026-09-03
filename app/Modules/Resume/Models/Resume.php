<?php

namespace App\Modules\Resume\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resume extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'first_name',
        'last_name',
        'photo',
        'phone',
        'whatsapp',
        'email',
        'location',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'summary',
        'work_experiences',
        'education',
        'skills',
        'languages',
        'projects',
        'certificates',
        'awards',
        'volunteer_experiences',
        'is_default',
        'is_public',
    ];

    protected $casts = [
        'work_experiences' => 'array',
        'education' => 'array',
        'skills' => 'array',
        'languages' => 'array',
        'projects' => 'array',
        'certificates' => 'array',
        'awards' => 'array',
        'volunteer_experiences' => 'array',
        'is_default' => 'boolean',
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? ''));
    }

    public function getWhatsappUrlAttribute(): ?string
    {
        if (!$this->whatsapp) {
            return null;
        }
        $cleanNumber = preg_replace('/[^0-9]/', '', $this->whatsapp);
        return 'https://wa.me/' . $cleanNumber;
    }
}
