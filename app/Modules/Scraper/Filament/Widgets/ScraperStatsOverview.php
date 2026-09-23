<?php

namespace App\Modules\Scraper\Filament\Widgets;

use App\Modules\Scraper\Models\ScraperRun;
use App\Modules\Scraper\Models\ScraperSourceStatus;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class ScraperStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = -10;

    protected static bool $isLazy = false;

    protected function getStats(): array
    {
        $tz = 'Asia/Baku';
        $last = ScraperRun::latest('id')->first();
        $listing = (int) ScraperSourceStatus::sum('inserted');
        $last24h = (int) DB::table('scraped_vacancies')->where('created_at', '>=', Carbon::now()->subDay())->count();
        $avg = (int) round((float) (DB::table('scraper_runs')
            ->whereNotNull('started_at')->whereNotNull('finished_at')
            ->selectRaw('avg(extract(epoch from (finished_at - started_at))) as s')->value('s') ?? 0));

        return [
            Stat::make('Son tarama', $last?->finished_at?->timezone($tz)->format('d.m.Y H:i') ?? '—')
                ->description(($last?->region ?? '') . ' ' . ($last?->mode ?? ''))
                ->color('primary'),
            Stat::make('Toplam eklenen ilan', number_format($listing))
                ->description(ScraperSourceStatus::count() . ' kaynak')
                ->color('success'),
            Stat::make('Son 24 saatte eklenen', number_format($last24h))
                ->description('scraped_vacancies')
                ->color('success'),
            Stat::make('Ortalama süre', $avg >= 60 ? floor($avg / 60) . ' dəq ' . ($avg % 60) . ' sn' : $avg . ' sn')
                ->description('saat dilimi: ' . $tz)
                ->color('gray'),
        ];
    }
}
