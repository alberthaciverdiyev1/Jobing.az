<?php

namespace App\Modules\Story\Filament\Resources\CompanyStoryResource\Pages;

use App\Modules\Story\Filament\Resources\CompanyStoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCompanyStory extends EditRecord
{
    protected static string $resource = CompanyStoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
