<?php

namespace App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWorkplaceTypes extends ListRecords
{
    protected static string $resource = WorkplaceTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni Çalışma Yeri Əlavə Et'),
        ];
    }
}
