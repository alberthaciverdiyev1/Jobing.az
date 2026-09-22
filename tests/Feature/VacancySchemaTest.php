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

    public function test_web_listing_prioritizes_native_vacancies_before_scraped_vacancies(): void
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

        $jobs = app(VacancyService::class)->getPaginatedVacancies([], 12)['jobs'];

        $this->assertSame(2, $jobs->total());
        $this->assertInstanceOf(Vacancy::class, $jobs->items()[0]);
        $this->assertInstanceOf(ScrapedVacancy::class, $jobs->items()[1]);
    }
}
