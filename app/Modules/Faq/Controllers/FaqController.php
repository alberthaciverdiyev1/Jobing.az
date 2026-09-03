<?php

namespace App\Modules\Faq\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Faq\Models\Faq;
use Illuminate\View\View;

class FaqController extends Controller
{
    public function index(): View
    {
        $faqs = Faq::active()->get()->groupBy('category');

        return view('pages.faq.index', [
            'faqGroups' => $faqs,
        ]);
    }
}
