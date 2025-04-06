<?php

namespace Modules\API\Services;

use Illuminate\Http\JsonResponse;
use Modules\API\Interfaces\CrudInterface;

class VacancyService implements CrudInterface
{

    public function list(): JsonResponse
    {
        // TODO: Implement list() method.
    }

    public function details(int $id): JsonResponse
    {
        // TODO: Implement details() method.
    }

    public function add(array $data): JsonResponse
    {
        // TODO: Implement add() method.
    }

    public function update(int $id, array $data): JsonResponse
    {
        // TODO: Implement update() method.
    }

    public function delete(int $id): JsonResponse
    {
        // TODO: Implement delete() method.
    }
}
