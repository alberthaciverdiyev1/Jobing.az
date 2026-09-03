<?php

namespace App\Modules\Company\Filament\Resources\MessageTemplateResource\Pages;

use App\Modules\Company\Filament\Resources\MessageTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMessageTemplate extends EditRecord
{
    protected static string $resource = MessageTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
