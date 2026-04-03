<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp',
        'expires_at',
        'verified',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified' => 'boolean',
    ];

    /**
     * Kiểm tra OTP có hợp lệ không
     */
    public function isValid(): bool
    {
        return !$this->verified && $this->expires_at->isFuture();
    }

    /**
     * Đánh dấu OTP đã được xác thực
     */
    public function markAsVerified(): void
    {
        $this->update(['verified' => true]);
    }
}