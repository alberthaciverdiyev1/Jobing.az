<?php

namespace Modules\API\Interfaces;

use Illuminate\Http\JsonResponse;

interface CrudInterface
{
    /**
     * List all items
     *
     * @return JsonResponse
     */
    public function list(): JsonResponse;

    /**
     * item details.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function details(int $id): JsonResponse;

    /**
     * Add item.
     *
     * @param array $data
     * @return JsonResponse
     */
    public function add(array $data): JsonResponse;

    /**
     * Update item.
     *
     * @param int $id
     * @param array $data
     * @return JsonResponse
     */
    public function update(int $id, array $data): JsonResponse;

    /**
     * Delete current item.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id): JsonResponse;
}
