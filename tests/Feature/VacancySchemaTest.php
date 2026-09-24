<?php

namespace Tests\Feature;

use App\Modules\Vacancy\Models\ScrapedVacancy;
use App\Modules\Vacancy\Models\Vacancy;
use App\Modules\Vacancy\Services\VacancyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class VacancySchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_scraped_vacancies_are_independent_from_company_accounts(): void
    {
        $this->assertTrue(Schema::hasColumns('scraped_vacancies', [
            'company_name',
            'company_logo',
            'redirect_url',
            'category_id',
            'city_id',
        ]));
        $this->assertFalse(Schema::hasColumn('scraped_vacancies', 'company_id'));
    }

    public function test_vacancy_skills_use_a_pivot_table(): void
    {
        $this->assertTrue(Schema::hasColumns('skill_vacancy', ['vacancy_id', 'skill_id']));
        $this->assertFalse(Schema::hasColumn('vacancies', 'skills'));
    }

    public function test_native_listing_excludes_scraped_vacancies(): void
    {
        $this->createNativeAndScrapedVacancies();

        $jobs = app(VacancyService::class)->getPaginatedVacancies([], 12, false)['jobs'];

        $this->assertSame(1, $jobs->total());
        $this->assertInstanceOf(Vacancy::class, $jobs->items()[0]);
    }

    public function test_external_listing_merges_native_and_scraped_by_updated_at(): void
    {
        $this->createNativeAndScrapedVacancies();

        // Köhnə native elan + daha yeni scraped elan → scraped yuxarıda olmalıdır
        // (native elanlar həmişə yuxarıda saxlanılmır).
        Vacancy::query()->where('slug', 'native-vacancy')->update(['updated_at' => now()->subDays(3)]);

        $jobs = app(VacancyService::class)->getPaginatedVacancies([], 12, true)['jobs'];

        $this->assertSame(2, $jobs->total());
        $this->assertInstanceOf(ScrapedVacancy::class, $jobs->items()[0]);
        $this->assertInstanceOf(Vacancy::class, $jobs->items()[1]);
    }

    public function test_external_listing_keeps_newer_native_vacancy_above_older_scraped(): void
    {
        $this->createNativeAndScrapedVacancies();

        ScrapedVacancy::query()->where('slug', 'scraped-vacancy')->update(['updated_at' => now()->subDays(3)]);

        $jobs = app(VacancyService::class)->getPaginatedVacancies([], 12, true)['jobs'];

        $this->assertInstanceOf(Vacancy::class, $jobs->items()[0]);
        $this->assertInstanceOf(ScrapedVacancy::class, $jobs->items()[1]);
    }

    public function test_native_listing_page_hides_scraped_vacancies(): void
    {
        $this->createNativeAndScrapedVacancies();

        $this->get('/')
            ->assertOk()
            ->assertSee('Native vacancy')
            ->assertDontSee('Scraped vacancy');
    }

    public function test_external_listing_page_shows_native_and_scraped_vacancies(): void
    {
        $this->createNativeAndScrapedVacancies();

        $this->get('/diger-sitelerden')
            ->assertOk()
            ->assertSee('Native vacancy')
            ->assertSee('Scraped vacancy')
            ->assertSee('example.com');
    }

    public function test_empty_native_listing_suggests_external_listings(): void
    {
        $this->get('/?city[]=zzzznomatch')
            ->assertOk()
            ->assertSee('data-external-listing-suggestion', false);
    }

    public function test_empty_external_listing_does_not_suggest_itself(): void
    {
        $this->get('/diger-sitelerden?city[]=zzzznomatch')
            ->assertOk()
            ->assertDontSee('data-external-listing-suggestion', false);
    }

    private function createNativeAndScrapedVacancies(): void
    {
        Vacancy::withoutEvents(fn () => Vacancy::create([
            'title' => 'Native vacancy',
            'slug' => 'native-vacancy',
            'description' => 'Native description',
            'is_active' => true,
        ]));
        ScrapedVacancy::create([
            'company_name' => 'External Company',
            'redirect_url' => 'https://example.com/jobs/1',
            'title' => 'Scraped vacancy',
            'slug' => 'scraped-vacancy',
            'description' => 'Scraped description',
            'is_active' => true,
        ]);
    }
}
