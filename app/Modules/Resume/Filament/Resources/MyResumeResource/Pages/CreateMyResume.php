<?php

namespace App\Modules\Resume\Filament\Resources\MyResumeResource\Pages;

use App\Modules\Resume\Filament\Resources\MyResumeResource;
use App\Filament\Pages\CreateRecord;

class CreateMyResume extends CreateRecord
{
    protected static string $resource = MyResumeResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = auth()->id();

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
