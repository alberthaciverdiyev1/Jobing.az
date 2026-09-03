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
            Stat::make('Göndərilən Müraciətlər', $total)
                ->description('Şirkətlərə göndərdiyiniz CV-lər')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make('Aktiv Elanlarım', $seekerCount)
                ->description('Yayınlanan iş axtarış elanlarınız')
                ->descriptionIcon('heroicon-m-user-circle')
                ->color('emerald'),

            Stat::make('Elan Baxış Sayı', $totalViews)
                ->description('İşəgötürənlərin baxış sayı')
                ->descriptionIcon('heroicon-m-eye')
                ->color('info'),
        ];
    }
}
