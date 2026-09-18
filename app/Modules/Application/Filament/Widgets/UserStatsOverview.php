<?php

namespace App\Modules\Application\Filament\Widgets;

use App\Modules\Application\Models\Application;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\Auth;

class UserStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $userId = Auth::id();
        $query = Application::where('user_id', $userId);
        $total = (clone $query)->count();
        $accepted = (clone $query)->whereIn('status', ['Kabul', 'Teklif', 'Mülakat'])->count();

        $seekerQuery = \App\Modules\JobSeeker\Models\JobSeeker::where('user_id', $userId);
        $seekerCount = (clone $seekerQuery)->where('status', 'published')->count();
        $totalViews = (clone $seekerQuery)->sum('views_count');

        return [
            Stat::make(__('Submitted Applications'), $total)
                ->description(__('CVs you sent to companies'))
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make(__('My Active Listings'), $seekerCount)
                ->description(__('Your published job-seeking listings'))
                ->descriptionIcon('heroicon-m-user-circle')
                ->color('emerald'),

            Stat::make(__('Listing View Count'), $totalViews)
                ->description(__('Employer view count'))
                ->descriptionIcon('heroicon-m-eye')
                ->color('info'),
        ];
    }
}
