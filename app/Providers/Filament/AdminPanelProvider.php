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
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->profile()
            ->brandName('Jobing Portal')
            ->colors([
                'primary' => Color::Orange,
            ])
            ->font('Inter')
            ->maxContentWidth('full')
            ->databaseNotifications()
            ->breadcrumbs(false)
            ->favicon('https://img.icons8.com/isometric-line/64/4a90e2/briefcase.png')
            ->resources([
                \App\Modules\Vacancy\Filament\Resources\VacancyResource::class,
                \App\Modules\Category\Filament\Resources\CategoryResource::class,
                \App\Modules\ContactReveal\Filament\Resources\ContactRevealResource::class,
                \App\Modules\Company\Filament\Resources\CompanyResource::class,
                \App\Modules\Application\Filament\Resources\ApplicationResource::class,
                \App\Modules\ActivityLog\Filament\Resources\ActivityLogResource::class,
                \App\Modules\Blog\Filament\Resources\BlogResource::class,
                \App\Modules\Inquiry\Filament\Resources\InquiryResource::class,
                \App\Modules\Faq\Filament\Resources\FaqResource::class,
                \App\Modules\JobAttribute\Filament\Resources\JobTypeResource::class,
                \App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource::class,
                \App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource::class,
                \App\Modules\JobAttribute\Filament\Resources\SkillResource::class,
                \App\Modules\Company\Filament\Resources\MessageTemplateResource::class,
                \App\Modules\JobSeeker\Filament\Resources\JobSeekerResource::class,
                \App\Modules\Resume\Filament\Resources\ResumeResource::class,
                \App\Modules\Seo\Filament\Resources\PageSeoResource::class,
                \App\Modules\User\Filament\Resources\UserResource::class,
            ])
            ->pages([
                Pages\Dashboard::class,
                \App\Modules\Setting\Filament\Pages\ManageSiteSettings::class,
            ])
            ->widgets([
                \App\Modules\Home\Filament\Widgets\StatsOverview::class,
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
