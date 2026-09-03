<?php

namespace App\Modules\JobSeeker\Filament\Resources\JobSeekerResource\Pages;

use App\Modules\JobSeeker\Filament\Resources\JobSeekerResource;
use Filament\Resources\Pages\CreateRecord;

class CreateJobSeeker extends CreateRecord
{
    protected static string $resource = JobSeekerResource::class;
}
