<?php

namespace App\Modules\Scraper\Filament\Pages;

use App\Modules\Scraper\Models\ScraperRun;
use App\Modules\Scraper\Models\ScraperSourceRun;
use App\Modules\Scraper\Models\ScraperSetting;
use App\Modules\Scraper\Models\ScraperSourceStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ScraperStatus extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-arrow-path-rounded-square';

    protected static ?string $navigationLabel = 'Scraper Status';

    protected static ?string $title = 'Scraper Status';

    protected static string $view = 'filament.pages.scraper-status';

    protected static ?int $navigationSort = 90;

    protected function getHeaderWidgets(): array
    {
        return [\App\Modules\Scraper\Filament\Widgets\ScraperStatsOverview::class];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('runBaku')->label('Bakü — İndi başlat')->icon('heroicon-o-play')
                ->requiresConfirmation()->action(fn () => $this->runScript('cron-baku-daily.sh')),
            Action::make('runBoss')->label('boss.az — İndi başlat')->icon('heroicon-o-play')
                ->requiresConfirmation()->action(fn () => $this->runScript('cron-boss.sh')),
            Action::make('runOther')->label('Digər şəhərlər — İndi başlat')->icon('heroicon-o-play')
                ->requiresConfirmation()->action(fn () => $this->runScript('cron-other-weekend.sh')),
            Action::make('warmFacets')->label('Facet isitme')->icon('heroicon-o-bolt')
                ->action(fn () => $this->runFacets()),
        ];
    }

    protected function runScript(string $script): void
    {
        $root = '/var/www/JobScraper';
        $env = 'JOBING_ARTISAN=/var/www/new-jobing/artisan '
            . 'COMPANY_LOGO_PUBLISH_DIR=/var/www/new-jobing/storage/app/public/scraped-companies';
        $cmd = sprintf(
            'cd %s && nohup env %s bash %s >> /dev/null 2>&1 &',
            escapeshellarg($root), $env, escapeshellarg($root . '/scripts/' . $script)
        );
        exec($cmd);
        Notification::make()->title($script . ' başladı')->body('Arxa planda işə salındı.')->success()->send();
    }

    protected function runFacets(): void
    {
        exec('nohup php /var/www/new-jobing/artisan facets:refresh --warm >> /dev/null 2>&1 &');
        Notification::make()->title('Facet isitme başladı')->success()->send();
    }

    public function getViewData(): array
    {
        $tz = 'Asia/Baku';
        $now = Carbon::now($tz);
        $schedule = ScraperSetting::where('key', 'schedule')->first()?->value ?? [];

        $next = [
            'baku' => $this->nextAtTimes($now, [9, 14, 19]),
            'boss' => $this->nextDailyAt($now, 3),
            'other' => $this->nextWeeklyAt($now, Carbon::SATURDAY, 21),
        ];

        // Son 24 saatte eklenen ilanlar (kaynak bazında)
        $since = Carbon::now()->subDay();
        $perSource24h = DB::table('scraped_vacancies')
            ->where('created_at', '>=', $since)
            ->selectRaw("split_part(slug, '-', 1) as src, count(*) as c")
            ->groupBy('src')->pluck('c', 'src');
        $last24h = (int) $perSource24h->sum();

        // Trend: son 14 çalışmanın eklenen ilan sayısı (eskiden yeniye)
        $trend = ScraperRun::latest('id')->limit(14)->get()->reverse()->values();

        // Ortalama çalışma süresi (saniyə)
        $avgSeconds = (float) (DB::table('scraper_runs')
            ->whereNotNull('started_at')->whereNotNull('finished_at')
            ->selectRaw('avg(extract(epoch from (finished_at - started_at))) as s')
            ->value('s') ?? 0);

        // Günlük toplamlar (son 14 gün)
        $dailyRaw = DB::table('scraper_runs')->whereNotNull('finished_at')
            ->where('finished_at', '>=', Carbon::now()->subDays(13)->startOfDay())
            ->selectRaw("to_char(finished_at, 'YYYY-MM-DD') as d, sum(inserted) as ins")
            ->groupBy('d')->pluck('ins', 'd');
        $dailySeries = [];
        for ($i = 13; $i >= 0; $i--) {
            $day = Carbon::now()->subDays($i)->format('Y-m-d');
            $dailySeries[$day] = (int) ($dailyRaw[$day] ?? 0);
        }
        $dailyMax = max(1, max($dailySeries));

        // Kaynak bazında trend (son 10 çalışma)
        $perSourceTrend = ScraperSourceRun::orderBy('run_at')->get()
            ->groupBy('source')
            ->map(fn ($group) => $group->pluck('inserted')->take(-10)->values());

        return [
            'sources' => ScraperSourceStatus::orderBy('source')->get(),
            'runs' => ScraperRun::latest('id')->limit(10)->get(),
            'schedule' => $schedule,
            'next' => $next,
            'now' => $now,
            'lastRun' => ScraperRun::latest('id')->first(),
            'last24h' => $last24h,
            'perSource24h' => $perSource24h,
            'trend' => $trend,
            'trendMax' => max(1, (int) ($trend->max('inserted') ?? 1)),
            'avgSeconds' => $avgSeconds,
            'dailySeries' => $dailySeries,
            'dailyMax' => $dailyMax,
            'perSourceTrend' => $perSourceTrend,
            'cron' => [
                ['Bakü (günde 3)', '0 9,14,19 * * *', 'scripts/cron-baku-daily.sh'],
                ['boss.az (günde 1)', '0 3 * * *', 'scripts/cron-boss.sh'],
                ['Digər şəhərlər (həftə sonu)', '0 21 * * 6', 'scripts/cron-other-weekend.sh'],
                ['Facet/cache isitme (günde 3)', '0 */8 * * *', 'php artisan facets:refresh --warm'],
            ],
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

    private function nextAtTimes(Carbon $now, array $hours): Carbon
    {
        foreach ($hours as $hour) {
            $candidate = $now->copy()->setTime($hour, 0);
            if ($candidate->greaterThan($now)) {
                return $candidate;
            }
        }
        return $now->copy()->addDay()->setTime($hours[0], 0);
    }

    private function nextWeeklyAt(Carbon $now, int $dayOfWeek, int $hour): Carbon
    {
        $candidate = $now->copy()->next($dayOfWeek)->setTime($hour, 0);
        return $candidate;
    }
}
