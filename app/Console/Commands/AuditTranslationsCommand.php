<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AuditTranslationsCommand extends Command
{
    protected $signature = 'translations:audit';

    protected $description = 'Report missing JSON translation keys';

    public function handle(): int
    {
        $locales = ['az', 'en', 'ru', 'tr'];
        $translations = [];

        foreach ($locales as $locale) {
            $path = lang_path($locale . '.json');
            $translations[$locale] = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        }

        $allKeys = collect($translations)->flatMap(fn (array $items) => array_keys($items))->unique()->sort()->values();
        $issues = [];

        foreach ($allKeys as $key) {
            foreach ($locales as $locale) {
                if (!array_key_exists($key, $translations[$locale])) {
                    $issues[] = [$locale, 'missing', $key];
                    continue;
                }

            }
        }

        if ($issues === []) {
            $this->info('All JSON translation files contain the same translated keys.');
            return self::SUCCESS;
        }

        $this->table(['Locale', 'Issue', 'Key'], $issues);
        $this->error(count($issues) . ' translation issues found.');

        return self::FAILURE;
    }
}
