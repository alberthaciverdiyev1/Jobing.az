<?php

namespace App\Console\Commands;

use App\Modules\Vacancy\Services\VacancyService;
use App\Modules\Vacancy\Support\FacetCache;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Console\Command;

class RefreshFacetsCommand extends Command
{
    protected $signature = 'facets:refresh {--warm : Əsas siyahının ilk səhifələrini də isindir} {--pages=5 : İsidiləcək səhifə sayı}';

    protected $description = 'Facet və listing keşini təzələ və isindir (yeni veri sonrası)';

    public function handle(): int
    {
        $before = FacetCache::version();
        FacetCache::bump();
        $this->info('Facets version: ' . $before . ' -> ' . FacetCache::version());

        if ($this->option('warm')) {
            $service = app(VacancyService::class);
            $pages = max(1, (int) $this->option('pages'));
            // Yaygın sıralamalar + ilk səhifələr (soyuq istəklərin qarşısını alır).
            $sortVariants = [[], ['sort' => 'views'], ['sort' => 'salary_desc']];

            foreach ($sortVariants as $filters) {
                for ($page = 1; $page <= $pages; $page++) {
                    LengthAwarePaginator::currentPageResolver(fn () => $page);
                    $service->getPaginatedVacancies($filters, 30, true);
                }
            }

            LengthAwarePaginator::currentPageResolver(fn () => LengthAwarePaginator::resolveCurrentPage());
            $this->info("Listing cache isindi ({$pages} səhifə × " . count($sortVariants) . ' sıralama).');
        }

        return self::SUCCESS;
    }
}
