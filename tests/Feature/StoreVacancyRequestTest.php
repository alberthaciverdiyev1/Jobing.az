<?php

namespace Tests\Feature;

use App\Modules\Company\Models\Company;
use App\Modules\Vacancy\Requests\StoreVacancyRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class StoreVacancyRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_maximum_salary_cannot_be_lower_than_minimum_salary(): void
    {
        $validator = Validator::make(
            ['salary_min' => 2000, 'salary_max' => 1500],
            (new StoreVacancyRequest())->rules(),
            (new StoreVacancyRequest())->messages(),
        );

        $this->assertTrue($validator->errors()->has('salary_max'));
    }

    public function test_unlinked_user_cannot_post_with_an_existing_company_name(): void
    {
        Company::create(['name' => 'Existing Company']);

        $request = new StoreVacancyRequest();
        $validator = Validator::make(
            ['company_name' => '  existing company  '],
            $request->rules(),
            $request->messages(),
        );

        $this->assertTrue($validator->errors()->has('company_name'));
    }
}
