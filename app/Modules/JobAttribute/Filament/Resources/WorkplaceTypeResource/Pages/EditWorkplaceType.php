<?php

namespace App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWorkplaceType extends EditRecord
{
    protected static string $resource = WorkplaceTypeResource::class;

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
