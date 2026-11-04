<?php

namespace App\Modules\Story\Filament\Resources\StoryResource\Pages;

use App\Modules\Story\Filament\Resources\StoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateStory extends CreateRecord
{
    protected static string $resource = StoryResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = auth()->id();

        return $data;
    }
}
