<?php

namespace App\Modules\Company\Filament\Widgets;

use App\Modules\Application\Models\Application;
use App\Modules\Vacancy\Models\Vacancy;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\Auth;

class CompanyStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $companyId = Auth::user()?->company_id;

        $vacancyCount = Vacancy::where('company_id', $companyId)->count();
        $activeCount = Vacancy::where('company_id', $companyId)->active()->count();

        $applicationsQuery = Application::whereHas('vacancy', fn ($q) => $q->where('company_id', $companyId));
        $applicationCount = (clone $applicationsQuery)->count();
        $pendingCount = (clone $applicationsQuery)->where('status', \App\Modules\Application\Models\Application::STATUS_PENDING)->count();

        return [
            Stat::make('Toplam İlan', $vacancyCount)
                ->description($activeCount . ' aktiv yayında')
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('primary'),

            Stat::make('Toplam Başvuru', $applicationCount)
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info'),

            Stat::make('Bekleyen Başvuru', $pendingCount)
                ->description('İncelenmeyi bekliyor')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
