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
        'product_id',
        'color_id',
        'size_id',
        'price',
        'sale_price',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class, 'color_id');
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class, 'product_variant_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_variant_id');
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class, 'size_id');
        
    }
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}