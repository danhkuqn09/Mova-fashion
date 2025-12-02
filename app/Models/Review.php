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
        if ($this->relationLoaded('orderItem') && 
            $this->orderItem->relationLoaded('order') && 
            $this->orderItem->order->relationLoaded('user')) {
            return $this->orderItem->order->user;
        }
        
        return $this->orderItem->order->user;
    }

    // Accessor: Lấy product qua order_item → product_variant
    public function getProductAttribute()
    {
        if ($this->relationLoaded('orderItem') && 
            $this->orderItem->relationLoaded('productVariant') &&
            $this->orderItem->productVariant->relationLoaded('color') &&
            $this->orderItem->productVariant->color->relationLoaded('product')) {
            return $this->orderItem->productVariant->color->product;
        }
        
        return $this->orderItem->productVariant->color->product;
    }
}
