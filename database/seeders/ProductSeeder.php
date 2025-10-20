<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductColor;
use App\Models\ProductColorSize;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Please run CategorySeeder first.');
            return;
        }

        $products = [
            [
                'name' => 'Áo Thun Nam Basic',
                'price' => 150000,
                'sale_price' => 120000,
                'tag' => 'hot-sales',
                'description' => 'Áo thun nam basic chất liệu cotton 100%, thoáng mát, form regular fit phù hợp mọi dáng người.',
                'image' => 'uploads/products/ao-thun-nam-basic.jpg'
            ],
            [
                'name' => 'Áo Sơ Mi Nam Công Sở',
                'price' => 280000,
                'sale_price' => 250000,
                'tag' => null,
                'description' => 'Áo sơ mi nam công sở, chất liệu kate mềm mại, không nhăn, phù hợp đi làm và dự tiệc.',
                'image' => 'uploads/products/ao-so-mi-nam.jpg'
            ],
            [
                'name' => 'Quần Jean Nam Slim Fit',
                'price' => 450000,
                'sale_price' => 399000,
                'tag' => 'new-arrivals',
                'description' => 'Quần jean nam slim fit co giãn nhẹ, tôn dáng, phong cách trẻ trung năng động.',
                'image' => 'uploads/products/quan-jean-nam.jpg'
            ],
            [
                'name' => 'Áo Polo Nam',
                'price' => 200000,
                'sale_price' => null,
                'tag' => 'hot-sales',
                'description' => 'Áo polo nam chất liệu cá sấu cao cấp, thấm hút mồ hôi tốt, phù hợp mọi hoàn cảnh.',
                'image' => 'uploads/products/ao-polo-nam.jpg'
            ],
            [
                'name' => 'Áo Khoác Hoodie Unisex',
                'price' => 350000,
                'sale_price' => 299000,
                'tag' => 'new-arrivals',
                'description' => 'Áo khoác hoodie unisex, chất nỉ bông dày dặn, giữ ấm tốt, phong cách streetwear.',
                'image' => 'uploads/products/hoodie.jpg'
            ],
            [
                'name' => 'Váy Midi Nữ',
                'price' => 320000,
                'sale_price' => 280000,
                'tag' => null,
                'description' => 'Váy midi nữ thiết kế thanh lịch, chất vải lụa cao cấp, phù hợp đi làm và dạo phố.',
                'image' => 'uploads/products/vay-midi.jpg'
            ],
            [
                'name' => 'Đầm Dạ Hội',
                'price' => 650000,
                'sale_price' => 550000,
                'tag' => 'hot-sales',
                'description' => 'Đầm dạ hội sang trọng, thiết kế tôn dáng, phù hợp cho các buổi tiệc và sự kiện.',
                'image' => 'uploads/products/dam-da-hoi.jpg'
            ],
            [
                'name' => 'Quần Short Kaki Nam',
                'price' => 180000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Quần short kaki nam, chất liệu thoáng mát, form suông thoải mái cho mùa hè.',
                'image' => 'uploads/products/quan-short-kaki.jpg'
            ],
            [
                'name' => 'Áo Thun Nữ Croptop',
                'price' => 120000,
                'sale_price' => 99000,
                'tag' => 'new-arrivals',
                'description' => 'Áo thun nữ croptop form ôm, chất liệu cotton co giãn 4 chiều, trẻ trung năng động.',
                'image' => 'uploads/products/ao-croptop.jpg'
            ],
            [
                'name' => 'Blazer Nữ Công Sở',
                'price' => 480000,
                'sale_price' => 420000,
                'tag' => null,
                'description' => 'Blazer nữ công sở thiết kế lịch sự, chất liệu cao cấp, form chuẩn tôn dáng.',
                'image' => 'uploads/products/blazer-nu.jpg'
            ],
        ];

        $colors = ['Đen', 'Trắng', 'Xám', 'Xanh Navy', 'Đỏ', 'Hồng', 'Vàng', 'Nâu', 'Xanh Lá'];
        $sizes = ['S', 'M', 'L', 'XL', 'XXL'];

        foreach ($products as $productData) {
            $product = Product::create([
                'name' => $productData['name'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'sale_price' => $productData['sale_price'],
                'category_id' => $categories->random()->id,
                'tag' => $productData['tag'],
                'image' => $productData['image'],
            ]);

            // Tạo 2-3 màu cho mỗi sản phẩm
            $productColors = fake()->randomElements($colors, rand(2, 3));
            
            foreach ($productColors as $colorName) {
                $productColor = ProductColor::create([
                    'product_id' => $product->id,
                    'color' => $colorName,
                    'image' => 'uploads/colors/' . strtolower($colorName) . '.jpg',
                ]);

                // Tạo sizes cho mỗi màu
                $productSizes = fake()->randomElements($sizes, rand(3, 5));
                
                foreach ($productSizes as $size) {
                    ProductColorSize::create([
                        'product_color_id' => $productColor->id,
                        'size' => $size,
                        'quantity' => rand(5, 50),
                    ]);
                }
            }
        }

        // Tạo thêm 40 sản phẩm random
        $productNames = [
            'Áo Thun', 'Áo Polo', 'Áo Sơ Mi', 'Quần Jean', 'Quần Kaki', 'Quần Short',
            'Váy', 'Đầm', 'Áo Khoác', 'Áo Len', 'Quần Jogger', 'Áo Hoodie'
        ];

        for ($i = 0; $i < 40; $i++) {
            $productName = fake()->randomElement($productNames) . ' ' . fake()->randomElement(['Nam', 'Nữ', 'Unisex']);
            $price = fake()->numberBetween(10, 100) * 10000;
            $hasSale = fake()->boolean(60);
            
            $product = Product::create([
                'name' => $productName . ' #' . ($i + 1),
                'description' => fake()->paragraph(),
                'price' => $price,
                'sale_price' => $hasSale ? $price * 0.8 : null,
                'category_id' => $categories->random()->id,
                'tag' => fake()->optional(0.4)->randomElement(['hot-sales', 'new-arrivals']),
                'image' => 'uploads/products/placeholder.jpg',
            ]);

            $productColors = fake()->randomElements($colors, rand(1, 3));
            
            foreach ($productColors as $colorName) {
                $productColor = ProductColor::create([
                    'product_id' => $product->id,
                    'color' => $colorName,
                    'image' => 'uploads/colors/placeholder.jpg',
                ]);

                $productSizes = fake()->randomElements($sizes, rand(2, 5));
                
                foreach ($productSizes as $size) {
                    ProductColorSize::create([
                        'product_color_id' => $productColor->id,
                        'size' => $size,
                        'quantity' => rand(0, 100),
                    ]);
                }
            }
        }

        $this->command->info('Created ' . Product::count() . ' products with colors and sizes.');
    }
}
