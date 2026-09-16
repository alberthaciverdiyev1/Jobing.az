<?php

namespace App\Modules\Company\Filament\Resources\CompanyMessageTemplateResource\Pages;

use App\Modules\Company\Filament\Resources\CompanyMessageTemplateResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCompanyMessageTemplate extends CreateRecord
{
    protected static string $resource = CompanyMessageTemplateResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['company_id'] = auth()->user()?->company_id;

        return $data;
    }
}
