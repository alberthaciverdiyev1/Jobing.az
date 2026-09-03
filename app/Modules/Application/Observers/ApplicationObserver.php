<?php

namespace App\Modules\Application\Observers;

use App\Models\User;
use App\Modules\Application\Models\Application;
use Illuminate\Support\Str;

class ApplicationObserver
{
    /**
     * Send a Filament-compatible database notification to a user.
     */
    public static function notifyUser(User $user, string $title, string $body, string $icon = 'heroicon-o-bell', string $color = 'primary', ?string $url = null, ?string $urlLabel = null): void
    {
        $actions = [];
        if ($url) {
            $actions[] = [
                'name' => 'view',
                'label' => $urlLabel ?? 'Görüntüle',
                'url' => $url,
            ];
        }

        $data = [
            'title' => $title,
            'body' => $body,
            'icon' => $icon,
            'iconColor' => $color,
            'color' => $color,
            'actions' => $actions,
            'duration' => 'persistent',
            'format' => 'filament',
            'view' => 'filament-notifications::notification',
            'viewData' => [],
        ];

        $user->notifications()->create([
            'id' => (string) Str::uuid(),
            'type' => 'Filament\\Notifications\\DatabaseNotification',
            'data' => $data,
            'read_at' => null,
        ]);
    }

    /**
     * Handle the Application "created" event (User applies to vacancy -> Notify Company).
     */
    public function created(Application $application): void
    {
        $vacancy = $application->vacancy;
        if (!$vacancy) {
            return;
        }

        $company = $vacancy->company;
        if (!$company) {
            return;
        }

        // Find company users
        $companyUsers = User::where('company_id', $company->id)->get();
        if ($companyUsers->isEmpty() && $company->email) {
            $companyUsers = User::where('email', $company->email)->get();
        }
        if ($companyUsers->isEmpty()) {
            $companyUsers = User::where('user_type', 'company')->get();
        }

        foreach ($companyUsers as $companyUser) {
            self::notifyUser(
                $companyUser,
                'Yeni Vakansiya Müraciəti!',
                "{$application->applicant_name} sizin '{$vacancy->title}' vakansiyanıza müraciət etdi.",
                'heroicon-o-document-text',
                'primary',
                '/company/applications/' . $application->id . '/edit',
                'Müraciətə Bax'
            );
        }
    }

    /**
     * Handle the Application "updated" event (Status changes -> Notify Candidate).
     */
    public function updated(Application $application): void
    {
        if ($application->wasChanged('status')) {
            $candidateUser = $application->user ?? User::where('email', $application->applicant_email)->first();
            if (!$candidateUser) {
                return;
            }

            $companyName = $application->vacancy?->company?->name ?? 'İşəgötürən';
            $vacancyTitle = $application->vacancy?->title ?? 'Vakansiya';
            $status = $application->status;

            if (in_array($status, ['Interview', 'Mülakat', 'Müsahibə', 'Shortlisted', 'Seçilənlər'])) {
                self::notifyUser(
                    $candidateUser,
                    'Müsahibəyə Dəvət!',
                    "{$companyName} şirkəti sizə '{$vacancyTitle}' vakansiyası üzrə müsahibə mərhələsinə keçdiyinizi bildirdi.",
                    'heroicon-o-chat-bubble-left-right',
                    'warning',
                    '/user/my-applications',
                    'Müraciətlərim'
                );
            } elseif (in_array($status, ['Accepted', 'Kabul', 'Teklif', 'Qəbul Edildi'])) {
                self::notifyUser(
                    $candidateUser,
                    'Təbriklər! Müraciətiniz Qəbul Olundu',
                    "{$companyName} şirkəti '{$vacancyTitle}' vakansiyası üzrə müraciətinizi qəbul etdi!",
                    'heroicon-o-check-circle',
                    'success',
                    '/user/my-applications',
                    'Müraciətlərim'
                );
            } elseif (in_array($status, ['Rejected', 'Red', 'İmtina Edildi'])) {
                self::notifyUser(
                    $candidateUser,
                    'Müraciət Statusu Yeniləndi',
                    "{$companyName} şirkəti '{$vacancyTitle}' vakansiyası üzrə müraciətinizə imtina cavabı verdi.",
                    'heroicon-o-x-circle',
                    'danger',
                    '/user/my-applications',
                    'Müraciətlərim'
                );
            } elseif (in_array($status, ['Reviewed', 'İncelendi', 'Baxıldı'])) {
                self::notifyUser(
                    $candidateUser,
                    'Müraciətinizə Baxıldı',
                    "{$companyName} şirkəti '{$vacancyTitle}' vakansiyası üzrə müraciətinizin statusunu nəzərdən keçirdi.",
                    'heroicon-o-eye',
                    'info',
                    '/user/my-applications',
                    'Müraciətlərim'
                );
            } else {
                self::notifyUser(
                    $candidateUser,
                    'Müraciət Statusu Yeniləndi: ' . $status,
                    "{$companyName} şirkəti '{$vacancyTitle}' vakansiyası üzrə müraciətinizin statusunu yenilədi.",
                    'heroicon-o-bell',
                    'gray',
                    '/user/my-applications',
                    'Müraciətlərim'
                );
            }
        }
    }
}
