<?php

namespace App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateWorkplaceType extends CreateRecord
{
    protected static string $resource = WorkplaceTypeResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
