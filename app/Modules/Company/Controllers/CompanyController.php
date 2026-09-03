<?php

namespace App\Modules\Company\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Company\Services\CompanyService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CompanyController extends Controller
{
    public function __construct(
        protected CompanyService $companyService
    ) {}

    public function index(Request $request): View
    {
        $data = $this->companyService->getPaginatedCompanies($request->query());

        return view('pages.companies.index', $data);
    }

    public function show(string $slug): View
    {
        $company = $this->companyService->getCompanyBySlug($slug);

        abort_unless($company->hasPublicProfile(), 404);

        return view('pages.companies.show', compact('company'));
    }
}
