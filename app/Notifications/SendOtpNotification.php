<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendOtpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $otp;

    /**
     * Create a new notification instance.
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Mã OTP Xác Nhận Email - Mova Fashion')
                    ->greeting('Xin chào!')
                    ->line('Bạn đã đăng ký tài khoản tại Mova Fashion.')
                    ->line('Mã OTP của bạn là: **' . $this->otp . '**')
                    ->line('Mã này sẽ hết hạn sau 10 phút.')
                    ->line('Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.')
                    ->salutation('Trân trọng, Mova Fashion Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'otp' => $this->otp,
        ];
    }
}