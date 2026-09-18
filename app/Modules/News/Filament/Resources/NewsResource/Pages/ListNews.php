<?php

namespace App\Modules\News\Filament\Resources\NewsResource\Pages;

use App\Modules\News\Filament\Resources\NewsResource;
use Filament\Resources\Pages\ListRecords;

class ListNews extends ListRecords
{
    protected static string $resource = NewsResource::class;
}
