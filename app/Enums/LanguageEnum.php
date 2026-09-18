<?php

namespace App\Enums;

enum LanguageEnum: string
{
    case AZERBAIJANI = 'Azerbaijani';
    case TURKISH = 'Turkish';
    case ENGLISH = 'English';
    case RUSSIAN = 'Russian';
    case GERMAN = 'German';
    case FRENCH = 'French';
    case SPANISH = 'Spanish';
    case ITALIAN = 'Italian';
    case CHINESE = 'Chinese';
    case JAPANESE = 'Japanese';
    case ARABIC = 'Arabic';
    case PERSIAN = 'Persian';
    case GEORGIAN = 'Georgian';
    case UKRAINIAN = 'Ukrainian';
    case POLISH = 'Polish';
    case PORTUGUESE = 'Portuguese';
    case DUTCH = 'Dutch';
    case SWEDISH = 'Swedish';
    case NORWEGIAN = 'Norwegian';
    case DANISH = 'Danish';
    case FINNISH = 'Finnish';
    case CZECH = 'Czech';
    case HUNGARIAN = 'Hungarian';
    case ROMANIAN = 'Romanian';
    case GREEK = 'Greek';
    case HINDI = 'Hindi';
    case KOREAN = 'Korean';
    case VIETNAMESE = 'Vietnamese';
    case INDONESIAN = 'Indonesian';
    case URDU = 'Urdu';

    public function label(): string
    {
        return __('languages.' . $this->value);
    }

    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }
        return $options;
    }
}
