<?php

namespace App\Modules\Company\Filament\Resources\CompanyResource\Pages;

use App\Modules\Company\Filament\Resources\CompanyResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCompanies extends ListRecords
{
    protected static string $resource = CompanyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Yeni Şirket'),
        ];
    }
}
