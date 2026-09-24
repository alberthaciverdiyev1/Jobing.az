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
                'Yeni İlan Başvurusu!',
                "{$application->applicant_name} sizin '{$vacancy->title}' ilanınıza başvurdu.",
                'heroicon-o-document-text',
                'primary',
                '/company/applications/' . $application->id . '/edit',
                'Başvuruya Bak'
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

            $companyName = $application->vacancy?->company?->name ?? __('Employer');
            $vacancyTitle = $application->vacancy?->title ?? __('Vacancy');
            $status = $application->status;

            if (in_array($status, ['Interview', 'Mülakat', 'Mülakat', 'Shortlisted', 'Kısa Liste'])) {
                self::notifyUser(
                    $candidateUser,
                    'Mülakata Davet!',
                    "{$companyName} şirketi size '{$vacancyTitle}' ilanı için mülakat aşamasına geçtiğinizi bildirdi.",
                    'heroicon-o-chat-bubble-left-right',
                    'warning',
                    '/user/my-applications',
                    __('My Applications')
                );
            } elseif (in_array($status, ['Accepted', 'Kabul', 'Teklif', 'Kabul Edildi'])) {
                self::notifyUser(
                    $candidateUser,
                    'Tebrikler! Başvurunuz Kabul Edildi',
                    "{$companyName} şirketi '{$vacancyTitle}' ilanı için başvurunuzu kabul etti!",
                    'heroicon-o-check-circle',
                    'success',
                    '/user/my-applications',
                    __('My Applications')
                );
            } elseif (in_array($status, ['Rejected', 'Red', 'İmtina Edildi'])) {
                self::notifyUser(
                    $candidateUser,
                    'Başvuru Durumu Güncellendi',
                    "{$companyName} şirketi '{$vacancyTitle}' ilanı için başvurunuza ret cevabı verdi.",
                    'heroicon-o-x-circle',
                    'danger',
                    '/user/my-applications',
                    __('My Applications')
                );
            } elseif (in_array($status, ['Reviewed', 'İncelendi', 'Baxıldı'])) {
                self::notifyUser(
                    $candidateUser,
                    'Başvurunuz İncelendi',
                    "{$companyName} şirketi '{$vacancyTitle}' ilanı için başvurunuzun durumunu inceledi.",
                    'heroicon-o-eye',
                    'info',
                    '/user/my-applications',
                    __('My Applications')
                );
            } else {
                self::notifyUser(
                    $candidateUser,
                    'Başvuru Durumu Güncellendi: ' . $status,
                    "{$companyName} şirketi '{$vacancyTitle}' ilanı için başvurunuzun durumunu güncelledi.",
                    'heroicon-o-bell',
                    'gray',
                    '/user/my-applications',
                    __('My Applications')
                );
            }
        }
    }
}
