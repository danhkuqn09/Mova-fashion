<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductColorSize extends Model
{
    //
    protected $fillable = ['product_color_id', 'size', 'quantity'];

    public function color()
    {
        return $this->belongsTo(ProductColor::class, 'product_color_id');
    }
}
