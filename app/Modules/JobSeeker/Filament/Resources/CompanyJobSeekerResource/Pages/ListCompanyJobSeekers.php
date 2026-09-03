<?php

namespace App\Modules\JobSeeker\Filament\Resources\CompanyJobSeekerResource\Pages;

use App\Modules\JobSeeker\Filament\Resources\CompanyJobSeekerResource;
use Filament\Resources\Pages\ListRecords;

class ListCompanyJobSeekers extends ListRecords
{
    protected static string $resource = CompanyJobSeekerResource::class;
}
