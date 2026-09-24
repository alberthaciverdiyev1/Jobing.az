<?php

namespace App\Modules\Company\Support;

use App\Modules\Application\Models\Application;


class MessagePlaceholders
{
    
    public static function tokensText(): string
    {
        return __('{user} or {applicant_name} — candidate name, ')
            . __('{position} or {vacancy_title} — position, ')
            . __('{company} or {company_name} — company name, ')
            . __('{date} — date.');
    }

    
    public static function resolve(string $text, ?Application $application, ?string $fallbackName = null): string
    {
        $candidate = $application?->applicant_name ?: ($fallbackName ?: '');
        $vacancy = $application?->vacancy?->title;
        $company = $application?->vacancy?->company?->name;

        $map = [
            '{user}' => $candidate,
            '{applicant_name}' => $candidate,
            '{candidate}' => $candidate,
            '{position}' => $vacancy,
            '{vacancy_title}' => $vacancy,
            '{vacancy}' => $vacancy,
            '{company}' => $company,
            '{company_name}' => $company,
            '{date}' => now()->format('d.m.Y'),
        ];

        return strtr($text, array_filter($map, fn ($value) => $value !== null && $value !== ''));
    }
}
