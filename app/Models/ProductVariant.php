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
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function color(): BelongsTo
    {
        return $this->belongsTo(ProductColor::class, 'color_id');
    }
    
    // Relationship product qua color
    public function product()
    {
        return $this->hasOneThrough(
            Product::class,
            ProductColor::class,
            'id',           // Foreign key on product_colors table
            'id',           // Foreign key on products table
            'color_id',     // Local key on product_variants table
            'product_id'    // Local key on product_colors table
        );
    }

    // Accessor để lấy product
    public function getProductAttribute()
    {
        // Nếu đã load relationship 'color.product'
        if ($this->relationLoaded('color') && $this->color->relationLoaded('product')) {
            return $this->color->product;
        }
        
        // Nếu đã load relationship 'product' (hasOneThrough)
        if ($this->relationLoaded('product')) {
            return $this->getRelation('product');
        }
        
        // Fallback: load trực tiếp
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