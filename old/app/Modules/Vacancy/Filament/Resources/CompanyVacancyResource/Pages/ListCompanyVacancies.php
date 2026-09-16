<?php

namespace App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource\Pages;

use App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCompanyVacancies extends ListRecords
{
    protected static string $resource = CompanyVacancyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Yeni Vakansiya'),
        ];
    }
}
