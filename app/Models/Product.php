<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    use HasFactory;
    protected $fillable = ['name', 'image', 'price', 'sale_price', 'tag', 'description', 'category_id'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function colors()
    {
        return $this->hasMany(ProductColor::class);
    }
    public function reviews()
    {
        return $this->hasManyThrough(Review::class, OrderItem::class,
            'product_id',       // foreign key on order_items
            'order_item_id',    // foreign key on reviews
            'id',               // local key on products
            'id'                // local key on order_items
        );
    }
}
