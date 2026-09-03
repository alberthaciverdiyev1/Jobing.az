<?php

namespace App\Modules\JobAttribute\Filament\Resources\JobTypeResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\JobTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListJobTypes extends ListRecords
{
    protected static string $resource = JobTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni İş Rejimi Əlavə Et'),
        ];
    }
}
