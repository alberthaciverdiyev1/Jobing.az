<?php

namespace App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource\Pages;

use App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource;
use Filament\Notifications\Notification;
use App\Filament\Pages\CreateRecord;

class CreateCompanyVacancy extends CreateRecord
{
    protected static string $resource = CompanyVacancyResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['company_id'] = auth()->user()?->company_id;
        // Şirket elanı admin onayından sonra aktiv olur.
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
            ->title(__('Vacancy created successfully!'))
            ->body(__('Your listing will be published on the site after admin approval.'));
    }
}
