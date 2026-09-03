<?php

namespace App\Modules\Resume\Filament\Resources\MyResumeResource\Pages;

use App\Modules\Resume\Filament\Resources\MyResumeResource;
use Filament\Resources\Pages\ListRecords;

class ListMyResumes extends ListRecords
{
    protected static string $resource = MyResumeResource::class;
}
