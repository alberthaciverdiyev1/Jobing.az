<?php

namespace App\Modules\Inquiry\Filament\Resources\InquiryResource\Pages;

use App\Modules\Inquiry\Filament\Resources\InquiryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInquiries extends ListRecords
{
    protected static string $resource = InquiryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni Müraciət Əlavə Et'),
        ];
    }
}
