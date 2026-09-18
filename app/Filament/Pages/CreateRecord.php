<?php

namespace App\Filament\Pages;

use Filament\Resources\Pages\CreateRecord as BaseCreateRecord;

/**
 * Tüm Filament create sayfaları için ortak taban.
 * Form aksiyonları (Yarat) tam genişlikte gösterilir.
 */
class CreateRecord extends BaseCreateRecord
{
    protected function hasFullWidthFormActions(): bool
    {
        return true;
    }
}
