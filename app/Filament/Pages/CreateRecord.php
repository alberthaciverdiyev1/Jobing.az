<?php

namespace App\Filament\Pages;

use Filament\Resources\Pages\CreateRecord as BaseCreateRecord;

class CreateRecord extends BaseCreateRecord
{
    protected function hasFullWidthFormActions(): bool
    {
        return true;
    }
}
