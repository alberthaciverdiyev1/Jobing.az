<?php

namespace App\Modules\Vacancy\Filament\Resources\VacancyResource\Pages;

use App\Modules\Company\Models\Company;
use App\Modules\Vacancy\Filament\Resources\VacancyResource;
use Filament\Facades\Filament;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateVacancy extends CreateRecord
{
    protected static string $resource = VacancyResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (Filament::getCurrentPanel()?->getId() === 'company') {
            $user = auth()->user();
            $companyId = $user?->company_id;

            if (!$companyId && $user) {
                $company = Company::firstOrCreate(
                    ['name' => $user->name],
                    [
                        'email' => $user->email,
                        'slug' => Str::slug($user->name),
                    ]
                );
                $user->company_id = $company->id;
                $user->save();
                $companyId = $company->id;
            }

            $data['company_id'] = $companyId;
            // Vacancies created by company require Admin Approval before going active
            $data['is_active'] = false;
        }

        return $data;
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        if (Filament::getCurrentPanel()?->getId() === 'company') {
            return 'Vakansiya uğurla yaradıldı və Admin təsdiqinə göndərildi. Təsdiqləndikdən sonra saytda görünəcək.';
        }

        return 'Vakansiya yaradıldı';
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
