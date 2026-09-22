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

    public function index(Request $request): View|\Illuminate\Http\JsonResponse
    {
        $data = $this->companyService->getPaginatedCompanies($request->query());

        $isAjax = ($request->ajax() || $request->header('X-Partial') || $request->wantsJson()) && !$request->acceptsHtml();

        if ($isAjax) {
            return response()->json([
                'html' => view('pages.companies.partials.company-list', $data)->render(),
                'total' => $data['companies']->total(),
            ])
            ->header('Vary', 'X-Requested-With, Accept')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private');
        }

        return view('pages.companies.index', $data);
    }

    public function show(string $slug): View
    {
        $company = $this->companyService->getCompanyBySlug($slug);

        abort_unless($company->hasPublicProfile(), 404);

        return view('pages.companies.show', compact('company'));
    }
}
