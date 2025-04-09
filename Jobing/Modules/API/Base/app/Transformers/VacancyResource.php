<?php

namespace Base\app\Transformers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VacancyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->getAttribute('id'),
            'title' => $this->resource->getAttribute('title'),
            'slug' => $this->resource->getAttribute('slug'),
            'description' => $this->resource->getAttribute('description'),
            'location' => $this->resource->getAttribute('location'),
            'min_salary' => $this->resource->getAttribute('min_salary'),
            'max_salary' => $this->resource->getAttribute('max_salary'),
            'currency_sign' => $this->resource->getAttribute('currency_sign'),
            'category_id' => $this->resource->getAttribute('category_id'),
            'company_name' => $this->resource->getAttribute('company_name'),
            'city_id' => $this->resource->getAttribute('city_id'),
            'education_id' => $this->resource->getAttribute('education_id'),
            'experience_id' => $this->resource->getAttribute('experience_id'),
            'is_premium' => $this->resource->getAttribute('is_premium'),
            'job_type' => $this->resource->getAttribute('job_type'),
            'redirect_url' => $this->resource->getAttribute('redirect_url'),
            'posted_at' => $this->resource->getAttribute('posted_at'),
            'created_at' => $this->resource->getAttribute('created_at'),
        ];

    }
}
