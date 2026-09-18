<?php

namespace App\Modules\Vacancy\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VacancyApprovalRequestedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected string $title,
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
            'title' => __('New vacancy awaiting approval'),
            'body' => $this->title . ' — ' . $this->companyName,
            'actions' => $this->reviewUrl ? [['label' => __('Review'), 'url' => $this->reviewUrl]] : [],
        ];
    }
}
