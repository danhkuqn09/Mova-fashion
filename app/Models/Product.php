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

    public function colors(): HasMany
    {
        return $this->hasMany(ProductColor::class);
    }

    public function variants()
    {
        return $this->hasManyThrough(
            ProductVariant::class,
            ProductColor::class,
            'product_id',  // Foreign key on product_colors
            'color_id',    // Foreign key on product_variants
            'id',          // Local key on products
            'id'           // Local key on product_colors
        );
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
