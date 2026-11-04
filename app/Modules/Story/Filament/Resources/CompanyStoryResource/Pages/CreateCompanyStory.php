<?php

namespace App\Modules\Story\Filament\Resources\CompanyStoryResource\Pages;

use App\Modules\Story\Filament\Resources\CompanyStoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCompanyStory extends CreateRecord
{
    protected static string $resource = CompanyStoryResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $user = auth()->user();

        $data['user_id'] = $user?->id;
        $data['company_id'] = $user?->company_id;

        return $data;
    }
}
