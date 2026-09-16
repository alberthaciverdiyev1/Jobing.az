<?php

namespace App\Modules\Core\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::saving(function (Model $model) {
            $slugColumn = $model->getSlugColumn();
            $sourceColumn = $model->getSlugSourceColumn();

            // 1. If slug is completely empty, generate from source column
            if (empty($model->{$slugColumn})) {
                $sourceText = $model->{$sourceColumn} ?? '';
                $model->{$slugColumn} = $model->generateUniqueSlug($sourceText, $model->getKey());
                return;
            }

            // 2. If slug was manually provided or modified, ensure it is formatted and unique
            if ($model->isDirty($slugColumn)) {
                $rawSlug = Str::slug((string) $model->{$slugColumn});
                $model->{$slugColumn} = $model->generateUniqueSlug($rawSlug ?: $model->{$sourceColumn}, $model->getKey());
            }
        });
    }

    public function getSlugColumn(): string
    {
        return property_exists($this, 'slugColumn') ? $this->slugColumn : 'slug';
    }

    public function getSlugSourceColumn(): string
    {
        if (property_exists($this, 'slugSource')) {
            return $this->slugSource;
        }

        // Auto-detect commonly used source column names
        foreach (['title', 'name', 'headline', 'label'] as $candidate) {
            if (array_key_exists($candidate, $this->attributes) || in_array($candidate, $this->fillable ?? [])) {
                return $candidate;
            }
        }

        return 'name';
    }

    public function generateUniqueSlug(mixed $text, $ignoreId = null): string
    {
        if (is_array($text)) {
            $text = $text['az'] ?? $text['tr'] ?? $text['en'] ?? $text['ru'] ?? reset($text) ?: '';
        }

        $baseSlug = Str::slug((string) $text);
        if (empty($baseSlug)) {
            $baseSlug = 'item-' . Str::lower(Str::random(6));
        }

        $slug = $baseSlug;
        $counter = 1;

        while ($this->slugExists($slug, $ignoreId)) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    protected function slugExists(string $slug, $ignoreId = null): bool
    {
        $query = static::query();

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class))) {
            $query->withTrashed();
        }

        $query->where($this->getSlugColumn(), $slug);

        if ($ignoreId !== null) {
            $query->where($this->getKeyName(), '!=', $ignoreId);
        }

        return $query->exists();
    }
}
