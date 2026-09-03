<?php

namespace App\Modules\ActivityLog\Filament\Resources\ActivityLogResource\Pages;

use App\Modules\ActivityLog\Filament\Resources\ActivityLogResource;
use Filament\Resources\Pages\ListRecords;

class ListActivityLogs extends ListRecords
{
    protected static string $resource = ActivityLogResource::class;
}
