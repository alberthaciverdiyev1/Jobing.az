<?php

namespace App\Modules\Vacancy\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplyVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'applicant_name' => 'required_without:resume_id|nullable|string|max:255',
            'applicant_email' => 'required_without:resume_id|nullable|email|max:255',
            'applicant_phone' => 'nullable|string|max:30',
            'resume' => 'required_without:resume_id|nullable|file|mimes:pdf,doc,docx|max:10240',
            'resume_id' => 'nullable|exists:resumes,id',
            'portfolio_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'cover_letter' => 'nullable|string|max:3000',
        ];
    }
}
