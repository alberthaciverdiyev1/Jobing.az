<?php

namespace App\Modules\SystemLog\Filament\Resources\AppLogResource\Pages;

use App\Modules\SystemLog\Filament\Resources\AppLogResource;
use Filament\Resources\Pages\ListRecords;

class ListAppLogs extends ListRecords
{
    protected static string $resource = AppLogResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
