<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'color_id',
        'size',
        'price',
        'sale_price',
        'quantity',
        'image',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductColor::class, 'color_id');
    }
    
    // Helper để lấy product qua color
    public function getProductAttribute()
    {
        return $this->color->product;
    }
    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class, 'product_variant_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_variant_id');
    }

    
}