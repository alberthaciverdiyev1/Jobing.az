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
