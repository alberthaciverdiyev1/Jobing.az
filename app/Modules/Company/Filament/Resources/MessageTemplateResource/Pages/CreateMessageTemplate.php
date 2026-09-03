<?php

namespace App\Modules\Company\Filament\Resources\MessageTemplateResource\Pages;

use App\Modules\Company\Filament\Resources\MessageTemplateResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;

class CreateMessageTemplate extends CreateRecord
{
    protected static string $resource = MessageTemplateResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (Auth::user()?->isCompany() && Auth::user()?->company_id) {
            $data['company_id'] = Auth::user()->company_id;
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
