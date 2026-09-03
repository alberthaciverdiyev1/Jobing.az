<?php

use Illuminate\Support\Str;

if (!function_exists('generate_unique_slug')) {
    /**
     * Generate a unique slug for a given Eloquent model class.
     *
     * @param string|object $model Eloquent model class name or instance
     * @param mixed $title Source string or translatable array to generate slug from
     * @param string $column Slug column name (default 'slug')
     * @param int|string|null $ignoreId Model ID to ignore (for updates)
     * @return string
     */
    function generate_unique_slug(string|object $model, mixed $title, string $column = 'slug', $ignoreId = null): string
    {
        if (is_array($title)) {
            $title = $title['az'] ?? $title['tr'] ?? $title['en'] ?? $title['ru'] ?? reset($title) ?: '';
        }

        $baseSlug = Str::slug((string) $title);
        if (empty($baseSlug)) {
            $baseSlug = 'item-' . Str::lower(Str::random(6));
        }

        $queryClass = is_object($model) ? get_class($model) : $model;
        $slug = $baseSlug;
        $counter = 1;

        while (true) {
            $query = $queryClass::where($column, $slug);
            if ($ignoreId !== null) {
                $query->where('id', '!=', $ignoreId);
            }

            if (!$query->exists()) {
                break;
            }

            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
