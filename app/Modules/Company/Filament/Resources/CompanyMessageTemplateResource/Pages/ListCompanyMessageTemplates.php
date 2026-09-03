<?php

namespace App\Modules\Company\Filament\Resources\CompanyMessageTemplateResource\Pages;

use App\Modules\Company\Filament\Resources\CompanyMessageTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCompanyMessageTemplates extends ListRecords
{
    protected static string $resource = CompanyMessageTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Şablon Əlavə Et'),
        ];
    }
}
