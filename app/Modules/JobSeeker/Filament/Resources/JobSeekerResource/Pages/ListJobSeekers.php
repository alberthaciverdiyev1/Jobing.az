<?php

namespace App\Modules\JobSeeker\Filament\Resources\JobSeekerResource\Pages;

use App\Modules\JobSeeker\Filament\Resources\JobSeekerResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListJobSeekers extends ListRecords
{
    protected static string $resource = JobSeekerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label(__('Add New Listing')),
        ];
    }
}
