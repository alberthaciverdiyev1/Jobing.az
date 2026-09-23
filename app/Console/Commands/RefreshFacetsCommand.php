<?php

namespace App\Console\Commands;

use App\Modules\Vacancy\Support\FacetCache;
use Illuminate\Console\Command;

class RefreshFacetsCommand extends Command
{
    protected $signature = 'facets:refresh {--warm : Əsas siyahını da isindir}';

    protected $description = 'Facet və listing keşini təzələ (yeni veri sonrası)';

    public function handle(): int
    {
        $before = FacetCache::version();
        FacetCache::bump();
        $this->info('Facets version: ' . $before . ' -> ' . FacetCache::version());

        if ($this->option('warm')) {
            app(\App\Modules\Vacancy\Services\VacancyService::class)->getPaginatedVacancies([], 30, true);
            $this->info('Listing cache isindi.');
        }

        return self::SUCCESS;
    }
}
