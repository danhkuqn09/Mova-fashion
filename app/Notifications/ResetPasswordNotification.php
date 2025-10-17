<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    /**
     * Tạo mới thông báo với token.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Kênh gửi thông báo (email).
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Nội dung email gửi cho người dùng.
     */
    public function toMail($notifiable)
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173'); // URL FE của bạn
        $resetUrl = "{$frontendUrl}/reset-password/{$this->token}?email={$notifiable->getEmailForPasswordReset()}";

        return (new MailMessage)
            ->subject('Đặt lại mật khẩu tài khoản của bạn')
            ->greeting('Xin chào ' . $notifiable->name . '!')
            ->line('Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.')
            ->action('Đặt lại mật khẩu', $resetUrl)
            ->line('Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.')
            ->salutation('Trân trọng, đội ngũ MOVA Fashion');
    }
}
