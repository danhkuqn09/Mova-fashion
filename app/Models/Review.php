<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'order_item_id',
        'rating',
        'content',
        'image',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    // Accessor: Lấy user qua order_item → order
    public function getUserAttribute()
    {
        return $this->orderItem->order->user;
    }

    // Accessor: Lấy product qua order_item → product_variant
    public function getProductAttribute()
    {
        return $this->orderItem->productVariant->product;
    }
}
