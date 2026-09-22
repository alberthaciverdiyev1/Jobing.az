<?php

namespace App\Modules\Vacancy\Support;

class ResumeSkillMatcher
{
    /** @return array{percentage: int, matched: int, required: int}|null */
    public static function compare(iterable $resumeSkills, ?array $vacancySkills): ?array
    {
        $required = self::normalize($vacancySkills);
        $resumeAliases = [];

        foreach ($resumeSkills as $skill) {
            $rawName = $skill->getRawOriginal('name');
            $translations = is_string($rawName) ? (json_decode($rawName, true) ?: []) : (array) $rawName;
            $names = array_values($translations);
            foreach ([...$names, $skill->slug] as $name) {
                if (is_string($name)) {
                    $normalized = self::normalizeValue($name);
                    if ($normalized !== '') {
                        $resumeAliases[$normalized] = true;
                    }
                }
            }
        }

        if ($resumeAliases === [] || $required === []) {
            return null;
        }

        $matched = count(array_filter($required, fn (string $skill): bool => isset($resumeAliases[$skill])));

        return [
            'percentage' => (int) round(($matched / count($required)) * 100),
            'matched' => $matched,
            'required' => count($required),
        ];
    }

    /** @return list<string> */
    private static function normalize(?array $skills): array
    {
        $normalized = [];

        foreach ($skills ?? [] as $skill) {
            if (is_array($skill)) {
                $skill = $skill['name'] ?? $skill['label'] ?? $skill['value'] ?? null;
            }

            if (! is_string($skill)) {
                continue;
            }

            $skill = self::normalizeValue($skill);
            if ($skill !== '') {
                $normalized[] = $skill;
            }
        }

        return array_values(array_unique($normalized));
    }

    private static function normalizeValue(string $skill): string
    {
        return mb_strtolower(preg_replace('/\s+/u', ' ', trim($skill)) ?? '');
    }
}
