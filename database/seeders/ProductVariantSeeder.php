<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Color;
use App\Models\ProductVariant;
use App\Models\Size;

class ProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $colors = Color::all();
        $sizes = Size::all();

        if ($products->isEmpty() || $colors->isEmpty() || $sizes->isEmpty()) {
            return;
        }

        foreach ($products as $product) {
            // Gán ngẫu nhiên 2-3 màu cho mỗi sản phẩm
            $productColors = $colors->random(rand(2, 3));
            foreach ($productColors as $color) {
                foreach ($sizes as $size) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'color_id' => $color->id,
                        'size_id' => $size->id,
                        'price' => $product->price,
                        'sale_price' => $product->sale_price,
                        'quantity' => rand(10, 50),
                    ]);
                }
            }
        }
    }
}
