<?php

namespace App\Modules\Seo\Filament\Resources\PageSeoResource\Pages;

use App\Modules\Seo\Filament\Resources\PageSeoResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPageSeos extends ListRecords
{
    protected static string $resource = PageSeoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni Səhifə SEO Əlavə Et'),
        ];
    }
}
