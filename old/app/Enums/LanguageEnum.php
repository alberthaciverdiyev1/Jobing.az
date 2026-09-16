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
        return match ($this) {
            self::AZERBAIJANI => 'Azərbaycan dili',
            self::TURKISH => 'Türk dili',
            self::ENGLISH => 'İngilis dili',
            self::RUSSIAN => 'Rus dili',
            self::GERMAN => 'Alman dili',
            self::FRENCH => 'Fransız dili',
            self::SPANISH => 'Ispan dili',
            self::ITALIAN => 'İtalyan dili',
            self::CHINESE => 'Çin dili',
            self::JAPANESE => 'Yapon dili',
            self::ARABIC => 'Ərəb dili',
            self::PERSIAN => 'Fars dili',
            self::GEORGIAN => 'Gürcü dili',
            self::UKRAINIAN => 'Ukrayna dili',
            self::POLISH => 'Polyak dili',
            self::PORTUGUESE => 'Portuqal dili',
            self::DUTCH => 'Niderland (Holland) dili',
            self::SWEDISH => 'İsveç dili',
            self::NORWEGIAN => 'Norveç dili',
            self::DANISH => 'Danimarka dili',
            self::FINNISH => 'Fin dili',
            self::CZECH => 'Çex dili',
            self::HUNGARIAN => 'Macar dili',
            self::ROMANIAN => 'Rumın dili',
            self::GREEK => 'Yunan dili',
            self::HINDI => 'Hindi dili',
            self::KOREAN => 'Koreya dili',
            self::VIETNAMESE => 'Vyetnam dili',
            self::INDONESIAN => 'İndoneziya dili',
            self::URDU => 'Urdu dili',
        };
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
