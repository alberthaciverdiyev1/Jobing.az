<?php

namespace App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListExperienceLevels extends ListRecords
{
    protected static string $resource = ExperienceLevelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni Təcrübə Səviyyəsi Əlavə Et'),
        ];
    }
}
