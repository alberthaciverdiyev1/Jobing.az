<?php

namespace App\Modules\Faq\Filament\Resources\FaqResource\Pages;

use App\Modules\Faq\Filament\Resources\FaqResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFaqs extends ListRecords
{
    protected static string $resource = FaqResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni SSS Əlavə Et'),
        ];
    }
}
