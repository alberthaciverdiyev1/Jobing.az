<?php

namespace App\Modules\JobAttribute\Filament\Resources\SkillResource\Pages;

use App\Modules\JobAttribute\Filament\Resources\SkillResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSkill extends EditRecord
{
    protected static string $resource = SkillResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
