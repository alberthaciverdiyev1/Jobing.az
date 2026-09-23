<?php

namespace App\Console\Commands;

use App\Modules\Vacancy\Services\VacancyService;
use App\Modules\Vacancy\Support\FacetCache;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Console\Command;

class RefreshFacetsCommand extends Command
{
    protected $signature = 'facets:refresh {--warm : Əsas siyahının ilk səhifələrini də isindir} {--pages=3 : İsidiləcək səhifə sayı}';

    protected $description = 'Facet və listing keşini təzələ (yeni veri sonrası)';

    public function handle(): int
    {
        $before = FacetCache::version();
        FacetCache::bump();
        $this->info('Facets version: ' . $before . ' -> ' . FacetCache::version());

        if ($this->option('warm')) {
            $service = app(VacancyService::class);
            $pages = max(1, (int) $this->option('pages'));

            for ($page = 1; $page <= $pages; $page++) {
                LengthAwarePaginator::currentPageResolver(fn () => $page);
                $service->getPaginatedVacancies([], 30, true);
            }

            LengthAwarePaginator::currentPageResolver(fn () => LengthAwarePaginator::resolveCurrentPage());
            $this->info("Listing cache isindi (1-{$pages} səhifə).");
        }

        return self::SUCCESS;
    }
}
