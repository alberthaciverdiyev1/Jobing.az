<?php

namespace App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource\Pages;

use App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource;
use Filament\Resources\Pages\CreateRecord;

class CreateMyJobSeeker extends CreateRecord
{
    protected static string $resource = MyJobSeekerResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = auth()->id();
        return $data;
    }
}
