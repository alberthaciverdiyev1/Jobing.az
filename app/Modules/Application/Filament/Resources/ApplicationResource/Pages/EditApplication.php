<?php

namespace App\Modules\Application\Filament\Resources\ApplicationResource\Pages;

use App\Modules\Application\Filament\Resources\ApplicationResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditApplication extends EditRecord
{
    protected static string $resource = ApplicationResource::class;

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

            Actions\DeleteAction::make(),
        ];
    }

    public function mount(int|string $record): void
    {
        parent::mount($record);

        /** @var \App\Modules\Application\Models\Application $appRecord */
        $appRecord = $this->getRecord();

        if (is_null($appRecord->viewed_at) && auth()->check() && auth()->user()->isCompany()) {
            $appRecord->update([
                'viewed_at' => now(),
            ]);

            if ($candidate = ($appRecord->user ?? \App\Models\User::where('email', $appRecord->applicant_email)->first())) {
                $companyName = $appRecord->vacancy?->company?->name ?? 'İşəgötürən';
                $vacancyTitle = $appRecord->vacancy?->title ?? 'Vakansiya';

                \App\Modules\Application\Observers\ApplicationObserver::notifyUser(
                    $candidate,
                    'CV-nizə Baxıldı',
                    "{$companyName} şirkəti '{$vacancyTitle}' vakansiyası üzrə göndərdiyiniz CV-yə baxdı.",
                    'heroicon-o-eye',
                    'info',
                    '/user/my-applications',
                    'Müraciətlərim'
                );
            }
        }
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
