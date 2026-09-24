<?php

namespace App\Modules\News\Console;

use App\Modules\News\Services\RssImportService;
use Illuminate\Console\Command;

class ImportNewsCommand extends Command
{
    protected $signature = 'news:import';

    protected $description = 'RSS kaynaklarından haberleri içe aktarır.';

    public function handle(RssImportService $service): int
    {
        $result = $service->importAll();

        if (empty($result)) {
            $this->warn('Aktif RSS kaynağı yok.');

            return self::SUCCESS;
        }

        foreach ($result as $name => $count) {
            $this->info("{$name}: {$count} yeni haber");
        }

        return self::SUCCESS;
    }
}
