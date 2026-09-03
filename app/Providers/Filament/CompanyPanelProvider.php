<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class CompanyPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('company')
            ->path('company')
            ->login()
            ->profile()
            ->brandName('Jobing Şirkət')
            ->colors([
                'primary' => Color::Sky,
            ])
            ->font('Inter')
            ->databaseNotifications()
            ->breadcrumbs(false)
            ->resources([
                \App\Modules\Vacancy\Filament\Resources\VacancyResource::class,
                \App\Modules\Application\Filament\Resources\ApplicationResource::class,
                \App\Modules\JobSeeker\Filament\Resources\JobSeekerResource::class,
                \App\Modules\Resume\Filament\Resources\ResumeResource::class,
                \App\Modules\Company\Filament\Resources\MessageTemplateResource::class,
            ])
            ->pages([
                \App\Modules\Company\Filament\Pages\CompanyProfile::class,
                Pages\Dashboard::class,
            ])
            ->widgets([
                \App\Modules\Company\Filament\Widgets\CompanyStatsOverview::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
