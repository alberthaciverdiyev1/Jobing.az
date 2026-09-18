<?php

namespace App\Modules\News\Filament\Resources\NewsResource\Pages;

use App\Modules\News\Filament\Resources\NewsResource;
use Filament\Resources\Pages\CreateRecord;

class CreateNews extends CreateRecord
{
    protected static string $resource = NewsResource::class;
}
