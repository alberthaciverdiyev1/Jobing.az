<?php

namespace App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource\Pages;

use App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCompanyVacancy extends CreateRecord
{
    protected static string $resource = CompanyVacancyResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['company_id'] = auth()->user()?->company_id;
        // Şirkət elanı admin onayından sonra aktiv olur.
        $data['is_active'] = false;

        return $data;
    }
}
