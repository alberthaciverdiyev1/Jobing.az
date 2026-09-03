<?php

namespace App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource\Pages;

use App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMyJobSeeker extends EditRecord
{
    protected static string $resource = MyJobSeekerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
