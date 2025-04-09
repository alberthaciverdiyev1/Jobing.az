<?php

namespace App\Enums;

enum Education: int
{
    case Secondary = 6;
    case Higher = 5;
    case IncompleteEducation = 4;
    case Bachelor = 3;
    case Master = 2;
    case Doctor = 1;

    public function label(): string
    {
        return match ($this) {
            self::Secondary => __('Secondary Education'),
            self::Higher => __('Higher Education'),
            self::IncompleteEducation => __('Incomplete Higher Education'),
            self::Bachelor => __('Bachelor\'s Degree'),
            self::Master => __('Master\'s Degree'),
            self::Doctor => __('Doctorate (PhD)'),
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ], self::cases());
    }
}
