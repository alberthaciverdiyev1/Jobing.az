<?php

namespace App\Modules\Application\Filament\Resources\MyApplicationsResource\Pages;

use App\Modules\Application\Filament\Resources\MyApplicationsResource;
use Filament\Resources\Pages\ViewRecord;

class ViewMyApplications extends ViewRecord
{
    protected static string $resource = MyApplicationsResource::class;

    public function mount(int | string $record): void
    {
        parent::mount($record);

        // Kullanıcı mesajı gördüyse rozet sönsün.
        $application = $this->record;
        if ($application && $application->user_id === auth()->id() && $application->hasUnseenReply()) {
            $application->update(['reply_seen_at' => now()]);
        }
    }
}
