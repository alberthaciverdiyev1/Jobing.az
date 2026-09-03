<?php

namespace App\Modules\Home\Filament\Widgets;

use App\Modules\Application\Models\Application;
use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\Vacancy\Models\Vacancy;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Toplam İlan', Vacancy::count())
                ->description(Vacancy::active()->count() . ' aktif yayında')
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('success')
                ->chart([7, 12, 10, 18, 14, 22, Vacancy::count()]),

            Stat::make('Toplam Başvuru', Application::count())
                ->description(Application::where('status', 'Beklemede')->count() . ' incelenmeyi bekliyor')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('warning')
                ->chart([3, 6, 8, 14, 12, 20, Application::count()]),

            Stat::make('Kayıtlı Şirket', Company::count())
                ->description(Company::where('is_verified', true)->count() . ' onaylı işveren')
                ->descriptionIcon('heroicon-m-building-office-2')
                ->color('primary')
                ->chart([2, 4, 6, 8, 9, 11, Company::count()]),

            Stat::make('Kategori & Alt Sektör', Category::count())
                ->description(Category::parents()->count() . ' ana, ' . Category::subcategories()->count() . ' alt kategori')
                ->descriptionIcon('heroicon-m-tag')
                ->color('info'),
        ];
    }
}
