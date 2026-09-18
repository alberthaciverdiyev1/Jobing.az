<?php

namespace App\Modules\News\Filament\Resources\NewsResource\Pages;

use App\Modules\News\Filament\Resources\NewsResource;
use Filament\Resources\Pages\EditRecord;

class EditNews extends EditRecord
{
    protected static string $resource = NewsResource::class;
}
