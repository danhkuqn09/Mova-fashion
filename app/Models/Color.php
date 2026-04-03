<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Color extends Model
{
    protected $fillable = [
        'name',
        'color_code',
        'image',
    ];

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'color_id');
    }
    // Lấy danh sách sản phẩm liên kết qua ProductVariant
    public function products()
    {
        return $this->hasManyThrough(
            Product::class,
            ProductVariant::class,
            'color_id', // Foreign key trên ProductVariant
            'id',       // Foreign key trên Product
            'id',       // Local key trên Color
            'product_id'// Local key trên ProductVariant
        );
    }
}
