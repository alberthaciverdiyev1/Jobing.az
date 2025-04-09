<?php

namespace Base\app\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Base\app\Models\Vacancy;
use Base\app\Transformers\VacancyResource;

class VacancyService
{


    public function index(array $params): JsonResponse
    {
        $query = Vacancy::select(
            'id',
            'title',
            'slug',
            'description',
            'location',
            'min_salary',
            'max_salary',
            'currency_sign',
            'category_id',
            'company_name',
            'city_id',
            'education_id',
            'experience_id',
            'is_premium',
            'job_type',
            'posted_at',
            'redirect_url'
        );

        $vacancies = $query->withoutTrashed()->get();

        return response()->json([
            'status' => 200,
            'data' => VacancyResource::collection($vacancies),
            'message' => 'Vacancy retrieved successfully'
        ]);

    }

    public function store(Request $request): JsonResource
    {
        // TODO: Implement store() method.
    }

    public function show(int $id): JsonResponse
    {
        $vacancy = Vacancy::withoutTrashed()->find($id);

        return response()->json([
            'status' => 200,
            'data' => VacancyResource::make($vacancy),
            'message' => 'Vacancy retrieved successfully'
        ]);
    }

    public function update(Request $request, int $id): JsonResource
    {
        // TODO: Implement update() method.
    }

    public function destroy(int $id): JsonResponse
    {
        // TODO: Implement destroy() method.
    }
}
