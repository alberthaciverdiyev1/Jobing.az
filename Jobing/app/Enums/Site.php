<?php

namespace App\Enums;

enum Site: string
{
    case BossAz = 'boss.az';
    case BusyAz = 'https://busy.az';
    case SmartJobAz = 'smartjob.az';
    case OfferAz = 'offer.az';
    case HelloJobAz = 'hellojob.az';
    case JobSearchAz = 'jobsearch.az';
    case JobingAz = 'jobing.az';

    public function id(): string
    {
        return match ($this) {
            self::BossAz => '0x001',
            self::BusyAz => '0x002',
            self::SmartJobAz => '0x003',
            self::OfferAz => '0x004',
            self::HelloJobAz => '0x005',
            self::JobSearchAz => '0x006',
            self::JobingAz => '0x007',
        };
    }
}
