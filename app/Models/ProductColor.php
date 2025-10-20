<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductColor extends Model
{
    //
    protected $fillable = ['product_id', 'color', 'image'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function sizes()
    {
        return $this->hasMany(ProductColorSize::class, 'product_color_id');
    }
}
