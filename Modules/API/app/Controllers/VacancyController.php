<?php

namespace Modules\API\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Modules\API\Services\VacancyService;

class VacancyController
{
    protected VacancyService $vacancyService;

    public function __construct(VacancyService $vacancyService)
    {
        $this->vacancyService = $vacancyService;
    }

    public function index(Request $request): JsonResponse
    {
       return $this->vacancyService->index($request);

    }

    public function store(Request $request): JsonResource
    {
        // TODO: Implement store() method.
    }

    public function show(int $id): JsonResponse
    {
        return $this->vacancyService->show($id);
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
