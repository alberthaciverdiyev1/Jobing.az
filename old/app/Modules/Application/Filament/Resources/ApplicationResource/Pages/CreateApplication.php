<?php

namespace App\Modules\Application\Filament\Resources\ApplicationResource\Pages;

use App\Modules\Application\Filament\Resources\ApplicationResource;
use Filament\Resources\Pages\CreateRecord;

class CreateApplication extends CreateRecord
{
    protected static string $resource = ApplicationResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
