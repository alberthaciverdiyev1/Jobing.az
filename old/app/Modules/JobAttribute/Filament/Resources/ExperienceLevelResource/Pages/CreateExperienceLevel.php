<?php

namespace App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource;
use Filament\Resources\Pages\CreateRecord;

class CreateExperienceLevel extends CreateRecord
{
    protected static string $resource = ExperienceLevelResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
