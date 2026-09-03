<?php

namespace App\Modules\ContactReveal\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ContactReveal\Models\ContactReveal;
use App\Modules\JobSeeker\Models\JobSeeker;
use App\Modules\Vacancy\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactRevealController extends Controller
{
    /**
     * Reveal a job-seeker's contact details and log the interaction.
     */
    public function revealJobSeeker(Request $request, int $id): JsonResponse
    {
        $jobSeeker = JobSeeker::find($id);
        if (! $jobSeeker) {
            return response()->json(['success' => false, 'message' => 'Elan tapılmadı'], 404);
        }

        ContactReveal::log('job_seeker', $jobSeeker->id, $request);

        return response()->json([
            'success' => true,
            'email' => $jobSeeker->contact_email,
            'phone' => $jobSeeker->contact_phone,
            'clean_phone' => $jobSeeker->contact_phone ? preg_replace('/[^0-9+]/', '', $jobSeeker->contact_phone) : null,
            'call_url' => $jobSeeker->contact_phone ? 'tel:' . preg_replace('/[^0-9+]/', '', $jobSeeker->contact_phone) : null,
            'mailto_url' => $jobSeeker->contact_email ? 'mailto:' . $jobSeeker->contact_email : null,
        ]);
    }

    /**
     * Reveal a vacancy's contact details (employer email) and log the interaction.
     */
    public function revealVacancy(Request $request, int $id): JsonResponse
    {
        $vacancy = Vacancy::find($id);
        if (! $vacancy) {
            return response()->json(['success' => false, 'message' => 'Vakansiya tapılmadı'], 404);
        }

        ContactReveal::log('vacancy', $vacancy->id, $request);

        $email = $vacancy->application_email ?: ($vacancy->company?->email ?? null);

        return response()->json([
            'success' => true,
            'email' => $email,
            'mailto_url' => $email ? 'mailto:' . $email : null,
        ]);
    }
}
