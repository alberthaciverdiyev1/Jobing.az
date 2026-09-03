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
            self::Published => __('Yayınlandı'),
            self::Pending => __('Gözləmədə'),
            self::Rejected => __('İmtina edilib'),
            self::Closed => __('Bağlanıb'),
        };
    }
}
