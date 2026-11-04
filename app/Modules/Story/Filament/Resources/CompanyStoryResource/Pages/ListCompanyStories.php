<?php

namespace App\Modules\Story\Filament\Resources\CompanyStoryResource\Pages;

use App\Modules\Story\Filament\Resources\CompanyStoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCompanyStories extends ListRecords
{
    protected static string $resource = CompanyStoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
