<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_public_vacancy_route_is_registered(): void
    {
        $this->assertTrue(Route::has('jobs.index'));
    }
}
