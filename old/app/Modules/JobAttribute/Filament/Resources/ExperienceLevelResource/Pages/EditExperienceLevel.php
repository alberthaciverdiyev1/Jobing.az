<?php

namespace App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditExperienceLevel extends EditRecord
{
    protected static string $resource = ExperienceLevelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
