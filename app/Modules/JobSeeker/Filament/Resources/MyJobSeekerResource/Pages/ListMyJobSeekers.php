<?php

namespace App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource\Pages;

use App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMyJobSeekers extends ListRecords
{
    protected static string $resource = MyJobSeekerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni Elan Yaradın'),
        ];
    }
}
