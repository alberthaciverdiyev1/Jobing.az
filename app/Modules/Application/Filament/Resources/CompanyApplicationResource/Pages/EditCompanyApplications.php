<?php

namespace App\Modules\Application\Filament\Resources\CompanyApplicationResource\Pages;

use App\Modules\Application\Filament\Resources\CompanyApplicationResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCompanyApplications extends EditRecord
{
    protected static string $resource = CompanyApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('view_resume')
                ->label('CV-yə Bax')
                ->icon('heroicon-o-eye')
                ->color('warning')
                ->visible(fn (): bool => (bool) $this->record->resume_id)
                ->url(fn (): string => route('resumes.show', $this->record->resume_id), shouldOpenInNewTab: true),

            Actions\Action::make('download_pdf')
                ->label('PDF Endir')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('success')
                ->visible(fn (): bool => (bool) $this->record->resume_id)
                ->url(fn (): string => route('resumes.show', ['resume' => $this->record->resume_id, 'print' => 1]), shouldOpenInNewTab: true),

            Actions\Action::make('download_file')
                ->label('CV Faylını Endir')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('info')
                ->visible(fn (): bool => (bool) ($this->record->resume_path && ! $this->record->resume_id))
                ->url(fn (): string => asset('storage/' . $this->record->resume_path), shouldOpenInNewTab: true),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['notes'])) {
            // {user}, {position}, {company} ... yer tutucularını gerçek veriyle dəyiş.
            $data['notes'] = \App\Modules\Company\Support\MessagePlaceholders::resolve($data['notes'], $this->record);
        }

        return $data;
    }

    protected function afterSave(): void
    {
        $record = $this->record;

        if ($record->notes) {
            $record->viewed_at = $record->viewed_at ?? now();

            if ($record->wasChanged('notes') && $record->user_id && $record->user) {
                $record->user->notify(new \App\Modules\Application\Notifications\ApplicationRepliedNotification($record->notes, $record->vacancy?->title));
            }
        }

        $record->saveQuietly();
    }
}
