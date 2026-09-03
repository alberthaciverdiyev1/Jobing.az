<?php

namespace App\Modules\Resume\Filament\Resources\MyResumeResource\Pages;

use App\Modules\Resume\Filament\Resources\MyResumeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateMyResume extends CreateRecord
{
    protected static string $resource = MyResumeResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = auth()->id();

        return $data;
    }
}
