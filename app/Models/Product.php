<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
        'price',
        'sale_price',
        'tag',
        'description',
        'view_count',
        'category_id'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'view_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }


    // Lấy tất cả màu sắc của sản phẩm thông qua các biến thể (ProductVariant)
    public function colors()
    {
        return $this->hasManyThrough(
            Color::class,
            ProductVariant::class,
            'product_id', // Foreign key on product_variants
            'id',         // Foreign key on colors
            'id',         // Local key on products
            'color_id'    // Local key on product_variants
        )->distinct();
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Get all reviews through order_items
    public function reviews()
    {
        return Review::whereHas('orderItem.productVariant.color', function($query) {
            $query->where('product_id', $this->id);
        });
    }
}
