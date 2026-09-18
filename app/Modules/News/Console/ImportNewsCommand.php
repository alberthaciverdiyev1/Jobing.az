<?php

namespace App\Modules\News\Console;

use App\Modules\News\Services\RssImportService;
use Illuminate\Console\Command;

class ImportNewsCommand extends Command
{
    protected $signature = 'news:import';

    protected $description = 'RSS mənbələrindən xəbərləri idxal edir.';

    public function handle(RssImportService $service): int
    {
        $result = $service->importAll();

        if (empty($result)) {
            $this->warn('Aktiv RSS mənbəyi yoxdur.');

            return self::SUCCESS;
        }

        foreach ($result as $name => $count) {
            $this->info("{$name}: {$count} yeni xəbər");
        }

        return self::SUCCESS;
    }
}
