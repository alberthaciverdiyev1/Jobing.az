<?php

namespace App\Modules\Application\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationRepliedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected string $message,
        protected ?string $vacancyTitle = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => __('Şirkətinizdən yeni mesaj'),
            'body' => $this->vacancyTitle ? $this->message . "\n(" . $this->vacancyTitle . ')' : $this->message,
            'actions' => [],
        ];
    }
}
