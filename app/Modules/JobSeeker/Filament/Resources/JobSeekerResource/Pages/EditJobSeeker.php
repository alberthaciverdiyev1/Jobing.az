<?php

namespace App\Modules\JobSeeker\Filament\Resources\JobSeekerResource\Pages;

use App\Modules\JobSeeker\Filament\Resources\JobSeekerResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditJobSeeker extends EditRecord
{
    protected static string $resource = JobSeekerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
