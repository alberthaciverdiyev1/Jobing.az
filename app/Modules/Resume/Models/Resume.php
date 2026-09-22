<?php

namespace App\Modules\Resume\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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

    protected static function booted(): void
    {
        static::saving(function (Resume $resume) {
            if ($resume->is_default && $resume->user_id) {
                static::where('user_id', $resume->user_id)
                    ->where('id', '!=', $resume->id ?? 0)
                    ->update(['is_default' => false]);
            }
        });

        static::saved(function (Resume $resume) {
            $resume->syncSkillRecordsFromJson();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Modules\Application\Models\Application::class);
    }

    public function skillRecords(): BelongsToMany
    {
        return $this->belongsToMany(\App\Modules\JobAttribute\Models\Skill::class, 'resume_skill')
            ->withPivot('level')
            ->withTimestamps();
    }

    public function syncSkillRecordsFromJson(): void
    {
        if (! \Illuminate\Support\Facades\Schema::hasTable('resume_skill')) {
            return;
        }

        $catalog = \App\Modules\JobAttribute\Models\Skill::query()->get(['id', 'name', 'slug']);
        $lookup = [];
        foreach ($catalog as $skill) {
            $rawName = $skill->getRawOriginal('name');
            $translations = is_string($rawName) ? (json_decode($rawName, true) ?: []) : (array) $rawName;
            $names = array_values($translations);
            foreach ([...$names, $skill->slug] as $name) {
                if (is_string($name) && trim($name) !== '') {
                    $lookup[mb_strtolower(trim($name))] = $skill->id;
                }
            }
        }

        $sync = [];
        foreach ($this->skills ?? [] as $item) {
            $name = is_array($item) ? ($item['skill'] ?? $item['name'] ?? null) : $item;
            $level = is_array($item) ? ($item['level'] ?? 'advanced') : 'advanced';
            $skillId = is_string($name) ? ($lookup[mb_strtolower(trim($name))] ?? null) : null;
            if ($skillId) {
                $sync[$skillId] = ['level' => $level];
            }
        }

        $this->skillRecords()->sync($sync);
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
