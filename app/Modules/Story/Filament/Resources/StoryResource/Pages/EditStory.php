<?php

namespace App\Modules\Story\Filament\Resources\StoryResource\Pages;

use App\Modules\Story\Filament\Resources\StoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditStory extends EditRecord
{
    protected static string $resource = StoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
