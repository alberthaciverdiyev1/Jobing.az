<?php

namespace App\Modules\Seo\Filament\Pages;

use App\Modules\Seo\Services\SitemapService;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\File;

class ManageSitemap extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-document-magnifying-glass';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('System');
    }
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('Sitemap Management');
    }
    protected static ?string $title = null;

    public function getTitle(): string
    {
        return __('Sitemap XML Generator');
    }
    protected static ?int $navigationSort = 92;
    protected static ?string $slug = 'sitemap';

    protected static string $view = 'filament.pages.manage-sitemap';

    public array $sitemaps = [];

    public function mount(): void
    {
        $this->loadSitemaps();
    }

    public function loadSitemaps(): void
    {
        $this->sitemaps = [];
        $baseUrl = rtrim(config('app.url'), '/');

        foreach (File::glob(public_path() . '/sitemap*.xml') as $file) {
            $name = basename($file);
            $content = File::get($file);

            $urlCount = substr_count($content, '<url>');
            $isIndex = false;

            if ($urlCount === 0) {
                $urlCount = substr_count($content, '<sitemap>');
                $isIndex = true;
            }

            $this->sitemaps[] = [
                'name' => $name,
                'url' => $baseUrl . '/' . $name,
                'count' => $urlCount,
                'is_index' => $isIndex,
                'size' => round(filesize($file) / 1024, 2) . ' KB',
                'modified_at' => date('d.m.Y H:i:s', filemtime($file)),
            ];
        }

        usort($this->sitemaps, function ($a, $b) {
            if ($a['name'] === 'sitemap.xml') {
                return -1;
            }
            if ($b['name'] === 'sitemap.xml') {
                return 1;
            }

            return strcmp($a['name'], $b['name']);
        });
    }

    public function generateSitemap(SitemapService $sitemapService): void
    {
        try {
            $results = $sitemapService->generate();
            $this->loadSitemaps();

            Notification::make()
                ->title(__('Sitemap XML files generated successfully!'))
                ->body('Ümumi ' . count($results) . ' fayl yeniləndi.')
                ->success()
                ->send();
        } catch (\Throwable $e) {
            Notification::make()
                ->title(__('An error occurred while generating the sitemap!'))
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}
