<?php

namespace App\Modules\Company\Models;

use App\Modules\Localization\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageTemplate extends Model
{
    use HasFactory, HasTranslations;

    public array $translatable = ['title', 'content'];

    protected $fillable = [
        'company_id',
        'title',
        'type',
        'content',
        'is_active',
    ];

    protected $casts = [
        'title' => 'array',
        'content' => 'array',
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeForCompany(Builder $query, ?int $companyId): Builder
    {
        return $query->where(function ($q) use ($companyId) {
            $q->whereNull('company_id');
            if ($companyId) {
                $q->orWhere('company_id', $companyId);
            }
        });
    }
}
