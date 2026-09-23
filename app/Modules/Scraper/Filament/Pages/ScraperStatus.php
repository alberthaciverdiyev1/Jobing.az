<?php

namespace App\Modules\Scraper\Filament\Pages;

use App\Modules\Scraper\Models\ScraperRun;
use App\Modules\Scraper\Models\ScraperSetting;
use App\Modules\Scraper\Models\ScraperSourceStatus;
use Carbon\Carbon;
use Filament\Pages\Page;

class ScraperStatus extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-arrow-path-rounded-square';

    protected static ?string $navigationLabel = 'Scraper Status';

    protected static ?string $title = 'Scraper Status';

    protected static string $view = 'filament.pages.scraper-status';

    protected static ?int $navigationSort = 90;

    public function getViewData(): array
    {
        $tz = 'Asia/Baku';
        $now = Carbon::now($tz);
        $schedule = ScraperSetting::where('key', 'schedule')->first()?->value ?? [];

        $next = [
            'baku' => $this->nextDailyWindow($now, 8, 13),
            'boss' => $this->nextDailyAt($now, 3),
            'other' => $this->nextWeeklyAt($now, Carbon::SATURDAY, 21),
        ];

        return [
            'sources' => ScraperSourceStatus::orderBy('source')->get(),
            'runs' => ScraperRun::latest('id')->limit(10)->get(),
            'schedule' => $schedule,
            'next' => $next,
            'now' => $now,
            'lastRun' => ScraperRun::latest('id')->first(),
            'totals' => [
                'listings' => ScraperSourceStatus::sum('inserted'),
                'sources' => ScraperSourceStatus::count(),
            ],
            'tz' => $tz,
        ];
    }

    private function nextDailyAt(Carbon $now, int $hour): Carbon
    {
        $candidate = $now->copy()->setTime($hour, 0);
        return $candidate->lessThanOrEqualTo($now) ? $candidate->addDay() : $candidate;
    }

    private function nextDailyWindow(Carbon $now, int $startHour, int $lastStartHour): Carbon
    {
        $start = $now->copy()->setTime($startHour, 0);
        return $start->lessThanOrEqualTo($now) ? $start->addDay() : $start;
    }

    private function nextWeeklyAt(Carbon $now, int $dayOfWeek, int $hour): Carbon
    {
        $candidate = $now->copy()->next($dayOfWeek)->setTime($hour, 0);
        return $candidate;
    }
}
