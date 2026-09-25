<?php

namespace App\Modules\Visitor\Services;

use App\Modules\Visitor\Models\Visitor;
use App\Modules\Visitor\Models\VisitorHit;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class VisitorReportService
{
    /** Hesabat gün sərhədləri üçün biznes saat qurşağı (Azərbaycan, UTC+4). */
    protected string $timezone = 'Asia/Baku';

    /**
     * Günlük ziyarətçi hesabatı.
     *
     * Dəqiq "ziyarət" (page view) və unikal IP rəqəmləri `visitor_hits`
     * cədvəlindən hesablanır. "Ümumi" bölmə isə tarixi məlumat üçün
     * `visitors` cədvəlindən götürülür.
     */
    public function dailyReport(): array
    {
        $tz = $this->timezone;

        // Gün sərhədləri Bakı vaxtı ilə hesablanır, sonra sorğu üçün UTC-yə çevrilir.
        $startOfToday = now($tz)->startOfDay()->utc();
        $startOfYesterday = now($tz)->startOfDay()->subDay()->utc();
        $startOfWeek = now($tz)->subDays(7)->utc();
        $onlineThreshold = now()->subMinutes(5);

        $today = $this->hitStats($startOfToday);
        $yesterday = $this->hitStats($startOfYesterday, $startOfToday);

        $weeklyVisits = (int) VisitorHit::query()
            ->where('created_at', '>=', $startOfWeek)
            ->count();

        $online = (int) VisitorHit::query()
            ->where('created_at', '>=', $onlineThreshold)
            ->distinct()
            ->count('ip');

        // Tarixi (bütün zamanlar) cəmlər — köhnə `visitors` cədvəlindən.
        $allTime = Visitor::query()
            ->selectRaw('COUNT(*) as total_unique, COALESCE(SUM(visit_count), 0) as total_visits')
            ->first();

        $topIps = VisitorHit::query()
            ->where('created_at', '>=', $startOfToday)
            ->selectRaw('ip, COUNT(*) as visit_count, MAX(user_agent) as user_agent')
            ->groupBy('ip')
            ->orderByDesc('visit_count')
            ->limit(10)
            ->get();

        return [
            'today' => [
                'totalVisits' => (int) $today->total_visits,
                'uniqueVisitors' => (int) $today->unique_visitors,
            ],
            'yesterday' => [
                'totalVisits' => (int) $yesterday->total_visits,
                'uniqueVisitors' => (int) $yesterday->unique_visitors,
            ],
            'weekly' => ['totalVisits' => $weeklyVisits],
            'allTime' => [
                'totalVisits' => (int) ($allTime->total_visits ?? 0),
                'totalUnique' => (int) ($allTime->total_unique ?? 0),
            ],
            'online' => $online,
            'topIps' => $topIps,
            'hourlyStats' => $this->hourlyStats($startOfToday),
        ];
    }

    protected function hitStats(Carbon $from, ?Carbon $to = null): object
    {
        return VisitorHit::query()
            ->where('created_at', '>=', $from)
            ->when($to, fn ($q) => $q->where('created_at', '<', $to))
            ->selectRaw('COUNT(*) as total_visits, COUNT(DISTINCT ip) as unique_visitors')
            ->first();
    }

    /**
     * Bugünün saatlıq bölgüsü. created_at UTC saxlanıldığı üçün saat dəyəri
     * Bakı vaxtına (+4) çevrilir; EXTRACT həm PostgreSQL, həm MySQL 8+ ilə işləyir.
     *
     * @return Collection<int, object{hour:int, visits:int}>
     */
    protected function hourlyStats(Carbon $startOfTodayUtc): Collection
    {
        $rows = VisitorHit::query()
            ->where('created_at', '>=', $startOfTodayUtc)
            ->selectRaw('EXTRACT(HOUR FROM created_at) as h, COUNT(*) as visits')
            ->groupBy('h')
            ->get();

        return $rows
            ->groupBy(fn ($row) => ((int) $row->h + 4) % 24)
            ->map(fn ($group, $hour) => (object) [
                'hour' => (int) $hour,
                'visits' => (int) $group->sum('visits'),
            ])
            ->sortKeys()
            ->values();
    }
}
