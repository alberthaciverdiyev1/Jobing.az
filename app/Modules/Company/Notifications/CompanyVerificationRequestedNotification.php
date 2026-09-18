<?php

namespace App\Modules\Company\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CompanyVerificationRequestedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected string $companyName,
        protected ?string $reviewUrl = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => __('New company verification request'),
            'body' => $this->companyName . ' — ' . __('requested verification.'),
            'actions' => $this->reviewUrl
                ? [['label' => __('Review'), 'url' => $this->reviewUrl]]
                : [],
        ];
    }
}
