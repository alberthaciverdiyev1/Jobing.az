<?php

namespace App\Console\Commands;

use App\Modules\Vacancy\Services\VacancyService;
use App\Modules\Vacancy\Support\FacetCache;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Console\Command;

class RefreshFacetsCommand extends Command
{
    protected $signature = 'facets:refresh {--warm : Ana listenin ilk sayfalarını da ısıt} {--pages=5 : Isıtılacak sayfa sayısı}';

    protected $description = 'Facet ve liste önbelleğini yenile ve ısıt (yeni veriden sonra)';

    public function handle(): int
    {
        $before = FacetCache::version();
        FacetCache::bump();
        $this->info('Facets version: ' . $before . ' -> ' . FacetCache::version());

        if ($this->option('warm')) {
            $service = app(VacancyService::class);
            $pages = max(1, (int) $this->option('pages'));
            $sortVariants = [[], ['sort' => 'views'], ['sort' => 'salary_desc']];

            foreach ($sortVariants as $filters) {
                for ($page = 1; $page <= $pages; $page++) {
                    LengthAwarePaginator::currentPageResolver(fn () => $page);
                    $service->getPaginatedVacancies($filters, 30, true);
                }
            }

            LengthAwarePaginator::currentPageResolver(fn () => LengthAwarePaginator::resolveCurrentPage());
            $this->info("Liste önbelleği ısıtıldı ({$pages} sayfa × " . count($sortVariants) . ' sıralama).');
        }

        return self::SUCCESS;
    }
}
