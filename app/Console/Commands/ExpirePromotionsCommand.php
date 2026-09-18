<?php

namespace App\Console\Commands;

use App\Modules\JobSeeker\Models\JobSeeker;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Console\Command;

class ExpirePromotionsCommand extends Command
{
    protected $signature = 'promotions:expire {--dry-run : Sadece say, değişiklik yapma}';

    protected $description = 'Süresi dolan premium (is_featured / featured_until) kayıtları düşürür.';

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');
        $now = now();

        // 1) Süresi dolan vakansiya premium'ları
        $vacancies = Vacancy::query()
            ->where('is_featured', true)
            ->whereNotNull('featured_until')
            ->where('featured_until', '<', $now);

        // 2) Süresi dolan iş arayan premium'ları
        $seekers = JobSeeker::query()
            ->where('is_featured', true)
            ->whereNotNull('featured_until')
            ->where('featured_until', '<', $now);

        $vacancyCount = $vacancies->count();
        $seekerCount = $seekers->count();

        if (! $dry) {
            $vacancies->update(['is_featured' => false, 'featured_until' => null]);
            $seekers->update(['is_featured' => false, 'featured_until' => null]);
        }

        $this->info(sprintf(
            '%sVakansiya premium: %d, İş arayan premium: %d',
            $dry ? '[dry-run] ' : '',
            $vacancyCount,
            $seekerCount,
        ));

        return self::SUCCESS;
    }
}
