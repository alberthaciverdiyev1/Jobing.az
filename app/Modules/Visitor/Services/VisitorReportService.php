<?php

namespace App\Modules\Visitor\Services;

use App\Modules\Visitor\Models\Visitor;
use Illuminate\Support\Carbon;

class VisitorReportService
{
    /**
     * Günlük ziyarətçi hesabatı.
     *
     * Qeyd: `visitors` cədvəli hər IP üçün bir sətir saxlayır; `visit_count`
     * ümumi (kumulyativ) say, `last_visit` son ziyarət vaxtıdır. Buna görə
     * günlük "ziyarət" rəqəmi həmin gün aktiv olan IP-lərin kumulyativ
     * sayı kimi hesablanır (express-js branchindəki VisitorService ilə eyni məntiq).
     */
    public function dailyReport(): array
    {
        $now = Carbon::now();
        $startOfDay = $now->copy()->startOfDay();
        $startOfYesterday = $startOfDay->copy()->subDay();
        $startOfWeek = $now->copy()->subDays(7);
        $onlineThreshold = $now->copy()->subMinutes(5);

        $today = $this->stats($startOfDay);
        $yesterday = $this->stats($startOfYesterday, $startOfDay);

        $weeklyVisits = (int) Visitor::query()
            ->where('last_visit', '>=', $startOfWeek)
            ->sum('visit_count');

        $allTime = Visitor::query()
            ->selectRaw('COUNT(*) as total_unique, COALESCE(SUM(visit_count), 0) as total_visits')
            ->first();

        $online = (int) Visitor::query()
            ->where('last_visit', '>=', $onlineThreshold)
            ->count();

        $topIps = Visitor::query()
            ->where('last_visit', '>=', $startOfDay)
            ->orderByDesc('visit_count')
            ->limit(10)
            ->get(['ip', 'visit_count', 'user_agent', 'last_visit']);

        // EXTRACT(HOUR FROM ...) həm PostgreSQL, həm də MySQL 8+ ilə işləyir.
        $hourlyStats = Visitor::query()
            ->where('last_visit', '>=', $startOfDay)
            ->selectRaw('EXTRACT(HOUR FROM last_visit) as hour, COALESCE(SUM(visit_count), 0) as visits')
            ->groupBy('hour')
            ->orderBy('hour')
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
            'hourlyStats' => $hourlyStats,
        ];
    }

    protected function stats(Carbon $from, ?Carbon $to = null): object
    {
        return Visitor::query()
            ->where('last_visit', '>=', $from)
            ->when($to, fn ($q) => $q->where('last_visit', '<', $to))
            ->selectRaw('COUNT(*) as unique_visitors, COALESCE(SUM(visit_count), 0) as total_visits')
            ->first();
    }
}
