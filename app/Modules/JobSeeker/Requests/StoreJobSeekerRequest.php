<?php

namespace App\Modules\JobSeeker\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobSeekerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'job_type_id' => 'nullable|exists:job_types,id',
            'workplace_type_id' => 'nullable|exists:workplace_types,id',
            'experience_level_id' => 'nullable|exists:experience_levels,id',
            'skills' => 'nullable|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_negotiable' => 'nullable|boolean',
            'currency' => 'nullable|string|max:10',
            'location' => 'nullable|string|max:255',
            'availability' => 'nullable|in:immediate,two_weeks,one_month,flexible',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
        ];
    }
}
