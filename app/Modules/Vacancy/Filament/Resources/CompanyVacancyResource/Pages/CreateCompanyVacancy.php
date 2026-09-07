<?php

namespace App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource\Pages;

use App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateCompanyVacancy extends CreateRecord
{
    protected static string $resource = CompanyVacancyResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['company_id'] = auth()->user()?->company_id;
        // Şirkət elanı admin onayından sonra aktiv olur.
        $data['is_active'] = false;

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('Vakansiya uğurla yaradıldı!')
            ->body('Elanınız admin təsdiqindən sonra saytda yayımlanacaq.');
    }
}
