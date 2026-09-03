<?php

namespace App\Modules\JobAttribute\Filament\Resources\JobTypeResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\JobTypeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateJobType extends CreateRecord
{
    protected static string $resource = JobTypeResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
