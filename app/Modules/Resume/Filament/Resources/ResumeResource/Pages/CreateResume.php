<?php

namespace App\Modules\Resume\Filament\Resources\ResumeResource\Pages;

use App\Modules\Resume\Filament\Resources\ResumeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateResume extends CreateRecord
{
    protected static string $resource = ResumeResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = auth()->id();
        return $data;
    }
}
