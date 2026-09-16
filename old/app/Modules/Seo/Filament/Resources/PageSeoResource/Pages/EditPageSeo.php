<?php

namespace App\Modules\Seo\Filament\Resources\PageSeoResource\Pages;

use App\Modules\Seo\Filament\Resources\PageSeoResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPageSeo extends EditRecord
{
    protected static string $resource = PageSeoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
