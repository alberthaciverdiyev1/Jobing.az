<?php

namespace Tests\Feature;

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
}
