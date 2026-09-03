<?php

namespace App\Modules\Blog\Filament\Resources\BlogResource\Pages;

use App\Modules\Blog\Filament\Resources\BlogResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBlog extends CreateRecord
{
    protected static string $resource = BlogResource::class;
}
