<?php

namespace App\Modules\Resume\Filament\Resources\MyResumeResource\Pages;

use App\Modules\Resume\Filament\Resources\MyResumeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMyResume extends EditRecord
{
    protected static string $resource = MyResumeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
