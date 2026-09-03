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

class UserPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('user')
            ->path('user')
            // ->login() kaldırıldı: tek giriş noktası sitenin /login sayfası.
            ->profile()
            ->brandName('Jobing Hesabım')
            ->colors([
                'primary' => Color::Orange,
            ])
            ->databaseNotifications()
            ->breadcrumbs(false)
            ->font('Inter')
            ->maxContentWidth('full')
            ->resources([
                \App\Modules\Application\Filament\Resources\MyApplicationsResource::class,
                \App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource::class,
                \App\Modules\Resume\Filament\Resources\ResumeResource::class,
            ])
            ->pages([
                Pages\Dashboard::class,
            ])
            ->widgets([
                \App\Modules\Application\Filament\Widgets\UserStatsOverview::class,
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
                \App\Http\Middleware\RedirectCompanyFromUserPanel::class,
                Authenticate::class,
            ]);
    }
}
