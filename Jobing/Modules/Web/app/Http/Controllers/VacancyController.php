<?php

namespace Modules\Web\Http\Controllers;

use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Http;

class VacancyController
{
    public function list(Request $request){
        $response = Http::get(route('api.vacancies.index'));

        $vacancies = $response->json();
    }
}
