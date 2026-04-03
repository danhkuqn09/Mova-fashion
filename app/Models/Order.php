<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'voucher_id',
        'name',
        'email',
        'phone',
        'address',
        'status',
        'payment_status',
        'original_total',
        'discount_amount',
        'final_total',
        'payment_method',
        'transaction_id',
        'note',
    ];

    protected $casts = [
        'original_total' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_total' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Kiểm tra xem đơn hàng có thể hủy không
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    /**
     * Kiểm tra xem đơn hàng đã thanh toán chưa
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Kiểm tra xem đơn hàng đã hoàn tiền chưa
     */
    public function isRefunded(): bool
    {
        return $this->payment_status === 'refunded';
    }
}
