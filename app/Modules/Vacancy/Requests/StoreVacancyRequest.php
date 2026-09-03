<?php

namespace App\Modules\Vacancy\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (empty($this->currency)) {
            $this->merge([
                'currency' => 'AZN',
            ]);
        }
    }

    public function rules(): array
    {
        $hasCompany = auth()->check() && auth()->user()->company;
        $hasCompanyEmail = $hasCompany && !empty(auth()->user()->company->email);
        $isInternalOnly = $this->input('application_type') === 'internal';

        return [
            // If the user already has a linked company profile, company_name is disabled in the form
            // (not sent by browser) and resolved from their profile in VacancyService.
            // For guests or users without a linked company profile, company_name is required.
            'company_name' => $hasCompany ? 'nullable|string|max:255' : 'required|string|max:255',
            'company_website' => 'nullable|url|max:255',
            'company_email' => 'nullable|email|max:255',
            'company_location' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'job_type_id' => 'required|exists:job_types,id',
            'workplace_type_id' => 'required|exists:workplace_types,id',
            'experience_level_id' => 'required|exists:experience_levels,id',
            'location' => 'nullable|string|max:255',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'salary_negotiable' => 'nullable|boolean',
            'currency' => 'nullable|string|max:10',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'skills' => 'nullable',
            'skills.*' => 'string|max:100',
            'deadline' => 'nullable|date|after:today',
            'application_type' => auth()->check() ? 'required|in:internal,email,both' : 'required|in:email',
            // application_email is NEVER required if application_type is 'internal'.
            // For 'email' or 'both', it is required ONLY if the user has no company email to fall back to.
            'application_email' => $isInternalOnly
                ? 'nullable|email|max:255'
                : ($hasCompanyEmail ? 'nullable|email|max:255' : 'required|email|max:255'),
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'Şirkət adını qeyd edin.',
            'title.required' => 'Vakansiya / Pozisiya adını daxil edin.',
            'category_id.required' => 'Zəhmət olmasa, kateqoriya seçin.',
            'category_id.exists' => 'Seçilmiş kateqoriya etibarsızdır.',
            'job_type_id.required' => 'İş rejimini seçin.',
            'workplace_type_id.required' => 'Çalışma yerini seçin.',
            'experience_level_id.required' => 'Təcrübə səviyyəsini seçin.',
            'currency.required' => 'Valyutanı seçin.',
            'description.required' => 'İş təsviri və öhdəliklər mütləq doldurulmalıdır.',
            'application_email.required' => 'Müraciətlərin qəbul ediləcəyi e-poçt ünvanını daxil edin.',
            'application_email.email' => 'Düzgün e-poçt ünvanı daxil edin.',
            'deadline.after' => 'Son müraciət tarixi bugündən sonra olmalıdır.',
        ];
    }
}
