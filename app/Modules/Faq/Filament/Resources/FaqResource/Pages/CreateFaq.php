<?php

namespace App\Modules\Faq\Filament\Resources\FaqResource\Pages;

use App\Modules\Faq\Filament\Resources\FaqResource;
use Filament\Resources\Pages\CreateRecord;

class CreateFaq extends CreateRecord
{
    protected static string $resource = FaqResource::class;
}
