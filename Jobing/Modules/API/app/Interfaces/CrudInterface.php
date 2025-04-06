<?php

namespace Modules\API\Interfaces;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Interface for Controllers used by Route::apiResource.
 * Defines standard resource controller methods.
 */
interface CrudInterface
{
    /**
     * Display a listing of the resource.
     * Route: GET /api
     *
     * @param Request $request
     * @return ResourceCollection
     */
    public function index(Request $request): ResourceCollection;

    /**
     * Store a newly created resource.
     * Route: POST /api
     *
     * @param Request $request
     * @return JsonResource
     */
    public function store(Request $request): JsonResource;

    /**
     * Display the specified resource.
     * Route: GET /api/{id}
     *
     * @param int $id Resource ID
     * @return JsonResource
     */
    public function show(int $id): JsonResource;

    /**
     * Update the specified resource.
     * Route: PUT/PATCH /api/{id}
     *
     * @param Request $request
     * @param int $id Resource ID
     * @return JsonResource
     */
    public function update(Request $request, int $id): JsonResource;

    /**
     * Remove the specified resource.
     * Route: DELETE /api/{id}
     *
     * @param int $id Resource ID
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse;
}
