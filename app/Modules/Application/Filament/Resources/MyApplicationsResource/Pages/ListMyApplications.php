<?php

namespace App\Modules\Application\Filament\Resources\MyApplicationsResource\Pages;

use App\Modules\Application\Filament\Resources\MyApplicationsResource;
use Filament\Resources\Pages\ListRecords;

class ListMyApplications extends ListRecords
{
    protected static string $resource = MyApplicationsResource::class;
}
