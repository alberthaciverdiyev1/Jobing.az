<?php

namespace App\Modules\Localization\Traits;

trait HasTranslations
{
    /**
     * Get translated attribute with fallback.
     *
     * @param string $key
     * @param string|null $locale
     * @return mixed
     */
    public function getTranslation(string $key, ?string $locale = null): mixed
    {
        $locale = $locale ?: app()->getLocale();
        $translations = $this->getAttributeFromArray($key);

        if (is_string($translations)) {
            $decoded = json_decode($translations, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $translations = $decoded;
            } else {
                return $translations;
            }
        }

        if (!is_array($translations)) {
            return $translations;
        }

        if (!empty($translations[$locale])) {
            return $translations[$locale];
        }

        $fallbackLocale = config('app.fallback_locale', 'az');
        if (!empty($translations[$fallbackLocale])) {
            return $translations[$fallbackLocale];
        }

        return reset($translations) ?: '';
    }

    /**
     * Override getAttribute to dynamically translate translatable attributes.
     */
    public function getAttribute($key)
    {
        if (isset($this->translatable) && in_array($key, $this->translatable, true)) {
            return $this->getTranslation($key);
        }

        return parent::getAttribute($key);
    }
}
