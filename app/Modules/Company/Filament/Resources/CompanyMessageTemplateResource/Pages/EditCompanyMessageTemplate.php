<?php

namespace App\Modules\Company\Filament\Resources\CompanyMessageTemplateResource\Pages;

use App\Modules\Company\Filament\Resources\CompanyMessageTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCompanyMessageTemplate extends EditRecord
{
    protected static string $resource = CompanyMessageTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
