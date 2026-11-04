<?php

namespace App\Modules\Story\Filament\Resources\StoryResource\Pages;

use App\Modules\Story\Filament\Resources\StoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListStories extends ListRecords
{
    protected static string $resource = StoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
