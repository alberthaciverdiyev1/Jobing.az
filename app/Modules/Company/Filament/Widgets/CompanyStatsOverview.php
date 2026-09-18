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
            Stat::make(__('Total Listings'), $vacancyCount)
                ->description(__(':count active', ['count' => $activeCount]))
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('primary'),

            Stat::make(__('Total Applications'), $applicationCount)
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info'),

            Stat::make(__('Pending Applications'), $pendingCount)
                ->description(__('Pending review'))
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
