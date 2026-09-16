<?php

namespace App\Modules\Resume\Filament\Resources\MyResumeResource\Pages;

use App\Modules\Resume\Filament\Resources\MyResumeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMyResumes extends ListRecords
{
    protected static string $resource = MyResumeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni CV Əlavə Et'),
        ];
    }
}
