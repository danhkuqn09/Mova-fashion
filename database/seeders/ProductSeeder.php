<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Áo Nam (category_id = 4)
            [
                'name' => 'Áo Thun Nam Basic Trắng',
                'image' => 'products/ao-thun-trang.jpg',
                'price' => 199000,
                'sale_price' => 149000,
                'tag' => 'HOT',
                'description' => 'Áo thun nam basic chất liệu cotton 100% thoáng mát, form dáng regular fit phù hợp mọi vóc dáng.',
                'view_count' => 125,
                'category_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Sơ Mi Nam Công Sở',
                'image' => 'products/ao-somi-nam.jpg',
                'price' => 350000,
                'sale_price' => 299000,
                'tag' => 'NEW',
                'description' => 'Áo sơ mi nam công sở cao cấp, chất liệu kate mềm mại, không nhăn.',
                'view_count' => 89,
                'category_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Polo Nam Cao Cấp',
                'image' => 'products/ao-polo-nam.jpg',
                'price' => 280000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Áo polo nam chất liệu pique cao cấp, thấm hút mồ hôi tốt.',
                'view_count' => 67,
                'category_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Quần Nam (category_id = 5)
            [
                'name' => 'Quần Jean Nam Slim Fit',
                'image' => 'products/quan-jean-nam.jpg',
                'price' => 450000,
                'sale_price' => 399000,
                'tag' => 'SALE',
                'description' => 'Quần jean nam dáng slim fit ôm vừa vặn, chất liệu denim co giãn nhẹ.',
                'view_count' => 156,
                'category_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quần Kaki Nam Công Sở',
                'image' => 'products/quan-kaki-nam.jpg',
                'price' => 380000,
                'sale_price' => 320000,
                'tag' => null,
                'description' => 'Quần kaki nam form slim, chất liệu co giãn 4 chiều thoải mái.',
                'view_count' => 93,
                'category_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Áo Nữ (category_id = 6)
            [
                'name' => 'Áo Kiểu Nữ Tay Bồng',
                'image' => 'products/ao-kieu-nu.jpg',
                'price' => 280000,
                'sale_price' => 220000,
                'tag' => 'HOT',
                'description' => 'Áo kiểu nữ tay bồng thời trang, chất liệu voan mềm mại.',
                'view_count' => 234,
                'category_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Thun Nữ Croptop',
                'image' => 'products/ao-croptop.jpg',
                'price' => 150000,
                'sale_price' => null,
                'tag' => 'NEW',
                'description' => 'Áo thun nữ croptop trẻ trung, chất liệu cotton co giãn.',
                'view_count' => 178,
                'category_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Quần Nữ (category_id = 7)
            [
                'name' => 'Quần Jean Nữ Ống Rộng',
                'image' => 'products/quan-jean-nu.jpg',
                'price' => 420000,
                'sale_price' => 350000,
                'tag' => 'SALE',
                'description' => 'Quần jean nữ ống rộng trendy, chất liệu denim cao cấp.',
                'view_count' => 201,
                'category_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Váy Chữ A Nữ Công Sở',
                'image' => 'products/vay-chu-a.jpg',
                'price' => 320000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Váy chữ A nữ lịch sự, phù hợp môi trường công sở.',
                'view_count' => 142,
                'category_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Túi Xách (category_id = 8)
            [
                'name' => 'Túi Xách Nữ Da PU',
                'image' => 'products/tui-xach-nu.jpg',
                'price' => 450000,
                'sale_price' => 399000,
                'tag' => 'HOT',
                'description' => 'Túi xách nữ da PU cao cấp, thiết kế sang trọng.',
                'view_count' => 187,
                'category_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Thắt Lưng Nam Da Thật',
                'image' => 'products/that-lung-nam.jpg',
                'price' => 280000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Thắt lưng nam da thật 100%, khóa inox cao cấp.',
                'view_count' => 76,
                'category_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('products')->insert($products);
    }
}
