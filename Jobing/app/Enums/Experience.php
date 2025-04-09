<?php

namespace App\Enums;

enum Experience: int
{
    case Entry = 1;
    case Middle = 2;
    case Senior = 3;
    case Director = 4;

    public static function labels(): array
    {
        return [
            self::Entry->value   => 'Entry Level',
            self::Middle->value  => 'Mid Level',
            self::Senior->value  => 'Senior Level',
            self::Director->value => 'Director Level',
        ];
    }

    public function label(): string
    {
        return self::labels()[$this->value];
    }
}
