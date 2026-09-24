<?php

namespace App\Modules\Promotion\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Promotion\Models\PromotionRequest;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionRequestController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'vacancy_id' => 'required|integer|exists:vacancies,id',
            'mode' => 'required|in:premium,boost',
            'times' => 'required|integer|in:1,3,7',
            'phone' => 'nullable|string|max:30',
        ]);

        $vacancy = Vacancy::findOrFail($data['vacancy_id']);
        $user = auth()->user();

        if (! $user || (! $user->is_admin && (int) $user->company_id !== (int) $vacancy->company_id)) {
            return response()->json(['success' => false, 'message' => __('Permission denied')], 403);
        }

        $prices = config('site.promotions.' . ($data['mode'] === 'premium' ? 'premium' : 'bump') . '.prices', []);

        $promo = PromotionRequest::create([
            'vacancy_id' => $vacancy->id,
            'user_id' => $user->id,
            'mode' => $data['mode'],
            'times' => $data['times'],
            'price' => $prices[$data['times']] ?? null,
            'phone' => $data['phone'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['success' => true, 'id' => $promo->id]);
    }
}
