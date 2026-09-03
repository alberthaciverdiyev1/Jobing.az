<?php

namespace App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource\Pages;

use App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCompanyVacancy extends EditRecord
{
    protected static string $resource = CompanyVacancyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
