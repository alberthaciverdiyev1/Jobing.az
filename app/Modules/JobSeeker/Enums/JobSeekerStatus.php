<?php

namespace App\Modules\JobSeeker\Enums;

enum JobSeekerStatus: string
{
    case Published = 'published';
    case Pending = 'pending';
    case Rejected = 'rejected';
    case Closed = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::Published => __('Published'),
            self::Pending => __('Pending'),
            self::Rejected => __('Rejected'),
            self::Closed => __('Closed'),
        };
    }
}
