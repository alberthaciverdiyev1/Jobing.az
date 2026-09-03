<?php

namespace App\Modules\Resume\Filament\Resources\ResumeResource\Pages;

use App\Modules\Resume\Filament\Resources\ResumeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListResumes extends ListRecords
{
    protected static string $resource = ResumeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni CV Əlavə Et'),
        ];
    }
}
