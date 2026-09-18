<?php

namespace App\Modules\Promotion\Filament\Resources\PromotionRequestResource\Pages;

use App\Modules\Promotion\Filament\Resources\PromotionRequestResource;
use Filament\Resources\Pages\ListRecords;

class ListPromotionRequests extends ListRecords
{
    protected static string $resource = PromotionRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
