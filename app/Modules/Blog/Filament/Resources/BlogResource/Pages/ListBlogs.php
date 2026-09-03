<?php

namespace App\Modules\Blog\Filament\Resources\BlogResource\Pages;

use App\Modules\Blog\Filament\Resources\BlogResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListBlogs extends ListRecords
{
    protected static string $resource = BlogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Yeni Bloq Əlavə Et'),
        ];
    }
}
