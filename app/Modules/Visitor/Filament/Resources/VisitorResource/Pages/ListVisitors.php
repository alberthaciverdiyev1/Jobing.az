<?php

namespace App\Modules\Visitor\Filament\Resources\VisitorResource\Pages;

use App\Modules\Visitor\Filament\Resources\VisitorResource;
use Filament\Resources\Pages\ListRecords;

class ListVisitors extends ListRecords
{
    protected static string $resource = VisitorResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
