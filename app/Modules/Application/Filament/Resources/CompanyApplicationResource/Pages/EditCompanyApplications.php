<?php

namespace App\Modules\Application\Filament\Resources\CompanyApplicationResource\Pages;

use App\Modules\Application\Filament\Resources\CompanyApplicationResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCompanyApplications extends EditRecord
{
    protected static string $resource = CompanyApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
