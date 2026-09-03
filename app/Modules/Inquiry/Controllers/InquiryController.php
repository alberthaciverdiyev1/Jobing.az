<?php

namespace App\Modules\Inquiry\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inquiry\Models\Inquiry;
use App\Modules\Inquiry\Requests\ContactRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class InquiryController extends Controller
{
    public function index(): View
    {
        return view('pages.contact.index');
    }

    public function store(ContactRequest $request): JsonResponse|RedirectResponse
    {
        Inquiry::create([
            'user_id' => auth()->id(),
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone') ?? null,
            'subject' => $request->validated('subject') ?? null,
            'message' => $request->validated('message'),
            'type' => 'contact',
            'status' => 'new',
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => __('Mesajınız uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq.'),
            ]);
        }

        return back()->with('success', __('Mesajınız uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq.'));
    }
}
