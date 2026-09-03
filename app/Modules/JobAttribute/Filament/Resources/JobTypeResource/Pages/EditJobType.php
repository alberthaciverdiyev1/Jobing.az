<?php

namespace App\Modules\JobAttribute\Filament\Resources\JobTypeResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\JobTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditJobType extends EditRecord
{
    protected static string $resource = JobTypeResource::class;

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
