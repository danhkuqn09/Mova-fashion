<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Voucher extends Model
{
    protected $fillable = [
        'code',
        'discount_percent',
        'quantity',
        'min_total',
        'start_date',
        'end_date',
        'used_count',
        'is_active',
        'max_discount_amount',
    ];

    protected $casts = [
        'discount_percent' => 'integer',
        'quantity' => 'integer',
        'min_total' => 'integer',
        'used_count' => 'integer',
        'max_discount_amount' => 'integer',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Kiểm tra voucher có còn hiệu lực không
     */
    public function isValid(): bool
    {
        // Kiểm tra trạng thái
        if (!$this->is_active) {
            return false;
        }

        // Kiểm tra số lượng
        if ($this->used_count >= $this->quantity) {
            return false;
        }

        // Kiểm tra ngày bắt đầu
        if ($this->start_date && Carbon::now()->lt($this->start_date)) {
            return false;
        }

        // Kiểm tra ngày hết hạn
        if ($this->end_date && Carbon::now()->gt($this->end_date)) {
            return false;
        }

        return true;
    }

    /**
     * Kiểm tra voucher có thể áp dụng cho đơn hàng không
     */
    public function canApply(float $orderTotal): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        // Kiểm tra tổng đơn hàng tối thiểu
        if ($orderTotal < $this->min_total) {
            return false;
        }

        return true;
    }

    /**
     * Tính số tiền được giảm
     */
    public function calculateDiscount(float $orderTotal): float
    {
        if (!$this->canApply($orderTotal)) {
            return 0;
        }

        // Tính giảm giá theo phần trăm
        $discount = ($orderTotal * $this->discount_percent) / 100;

        // Áp dụng giảm giá tối đa nếu có
        if ($this->max_discount_amount && $discount > $this->max_discount_amount) {
            $discount = $this->max_discount_amount;
        }

        return $discount;
    }

    /**
     * Tăng số lần đã sử dụng
     */
    public function incrementUsedCount(): void
    {
        $this->increment('used_count');
    }

    /**
     * Scope: Lấy các voucher đang hoạt động
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Lấy các voucher còn hiệu lực
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
            ->where('used_count', '<', DB::raw('quantity'))
            ->where(function($q) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', Carbon::now());
            })
            ->where(function($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', Carbon::now());
            });
    }

    /**
     * Scope: Lấy các voucher đã hết hạn
     */
    public function scopeExpired($query)
    {
        return $query->where('end_date', '<', Carbon::now());
    }

    /**
     * Scope: Lấy các voucher đã hết số lượng
     */
    public function scopeOutOfStock($query)
    {
        return $query->whereColumn('used_count', '>=', 'quantity');
    }

    /**
     * Accessor: Kiểm tra voucher đã hết hạn chưa
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->end_date && Carbon::now()->gt($this->end_date);
    }

    /**
     * Accessor: Số lượng còn lại
     */
    public function getRemainingQuantityAttribute(): int
    {
        return max(0, $this->quantity - $this->used_count);
    }

    /**
     * Accessor: Trạng thái voucher
     */
    public function getStatusAttribute(): string
    {
        if (!$this->is_active) {
            return 'inactive';
        }

        if ($this->is_expired) {
            return 'expired';
        }

        if ($this->remaining_quantity <= 0) {
            return 'out_of_stock';
        }

        if ($this->start_date && Carbon::now()->lt($this->start_date)) {
            return 'upcoming';
        }

        return 'active';
    }
}
