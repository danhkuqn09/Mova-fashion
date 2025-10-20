<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'total_price',
        'status',
        'voucher_code',
        'discount_amount',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'discount_amount' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class, 'voucher_code', 'code');
    }
}
