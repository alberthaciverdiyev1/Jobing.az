<?php

namespace App\Modules\Promotion\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Promotion\Models\PromotionRequest;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionRequestController extends Controller
{
    /** Şirkət premium / irəli çək sorğusu göndərir. */
    public function store(Request $request, string $slug): JsonResponse
    {
        $vacancy = Vacancy::where('slug', $slug)->firstOrFail();
        $user = auth()->user();

        // Yalnız vakansiyanın sahibi şirkət (və ya admin) sorğu göndərə bilər.
        if (! $user || (! $user->is_admin && $user->company_id !== $vacancy->company_id)) {
            return response()->json(['success' => false, 'message' => __('Permission denied')], 403);
        }

        $data = $request->validate([
            'mode' => 'required|in:premium,boost',
            'times' => 'required|integer|in:1,3,7',
            'phone' => 'nullable|string|max:30',
        ]);

        $prices = config('site.promotions.' . ($data['mode'] === 'premium' ? 'premium' : 'bump') . '.prices', []);

        $promo = PromotionRequest::create([
            'vacancy_id' => $vacancy->id,
            'user_id' => $user->id,
            'mode' => $data['mode'],
            'times' => $data['times'],
            'price' => $prices[$data['times']] ?? null,
            'phone' => $data['phone'] ?? $user->phone,
            'status' => 'pending',
        ]);

        return response()->json(['success' => true, 'id' => $promo->id]);
    }
}
