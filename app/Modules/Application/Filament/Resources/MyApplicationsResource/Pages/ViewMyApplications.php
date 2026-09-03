<?php

namespace App\Modules\Application\Filament\Resources\MyApplicationsResource\Pages;

use App\Modules\Application\Filament\Resources\MyApplicationsResource;
use Filament\Resources\Pages\ViewRecord;

class ViewMyApplications extends ViewRecord
{
    protected static string $resource = MyApplicationsResource::class;

    protected function afterMount(): void
    {
        parent::afterMount();

        $record = $this->record;

        // Kullanıcı mesajı gördüyse rozet sönsün.
        if ($record && $record->user_id === auth()->id() && $record->hasUnseenReply()) {
            $record->update(['reply_seen_at' => now()]);
        }
    }
}
