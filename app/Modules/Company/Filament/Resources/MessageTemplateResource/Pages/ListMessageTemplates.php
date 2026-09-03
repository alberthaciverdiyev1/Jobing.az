<?php

namespace App\Modules\Company\Filament\Resources\MessageTemplateResource\Pages;

use App\Modules\Company\Filament\Resources\MessageTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMessageTemplates extends ListRecords
{
    protected static string $resource = MessageTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
