<?php

namespace App\Providers;

use App\View\Composers\NavbarComposer;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Filament panelinden çıkışta kullanıcı sitenin giriş sayfasına gider.
        $this->app->bind(
            \Filament\Http\Responses\Auth\Contracts\LogoutResponse::class,
            \App\Http\Responses\FilamentLogoutResponse::class,
        );
    }

    public function boot(): void
    {
        // Navbar bildirim verisini blade dışında (composer) hazırla.
        View::composer('components.navbar', NavbarComposer::class);

        \Filament\Support\Facades\FilamentView::registerRenderHook(
            \Filament\View\PanelsRenderHook::HEAD_END,
            fn (): \Illuminate\Support\HtmlString => new \Illuminate\Support\HtmlString('
                <style>
                    /* Filament container 3x reduced side padding */
                    .fi-main {
                        padding-left: 0.5rem !important;
                        padding-right: 0.5rem !important;
                    }
                    .fi-page {
                        padding-left: 0.5rem !important;
                        padding-right: 0.5rem !important;
                    }
                    @media (min-width: 640px) {
                        .fi-main, .fi-page {
                            padding-left: 0.75rem !important;
                            padding-right: 0.75rem !important;
                        }
                    }
                    @media (min-width: 1024px) {
                        .fi-main, .fi-page {
                            padding-left: 1rem !important;
                            padding-right: 1rem !important;
                        }
                    }

                    /* Expand main container max width */
                    .fi-main-ctn {
                        max-width: 100% !important;
                    }

                    /* Reduce section card padding */
                    .fi-section-content {
                        padding: 0.75rem 1rem !important;
                    }

                    /* Compact form component gaps */
                    .fi-fo-component-ctn {
                        gap: 0.75rem !important;
                    }
                </style>
            ')
        );
    }
}
