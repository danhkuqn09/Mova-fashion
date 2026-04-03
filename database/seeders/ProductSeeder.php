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
            // Áo Thun (category_id = 1)
            [
                'name' => 'Áo Thun Nam Basic',
                'image' => null,
                'price' => 199000,
                'sale_price' => 149000,
                'tag' => 'HOT',
                'description' => 'Áo thun nam basic chất liệu cotton 100% thoáng mát, form dáng regular fit phù hợp mọi vóc dáng.',
                'view_count' => 125,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Thun Nữ Croptop',
                'image' => null,
                'price' => 150000,
                'sale_price' => null,
                'tag' => 'NEW',
                'description' => 'Áo thun nữ croptop trẻ trung, chất liệu cotton co giãn.',
                'view_count' => 178,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Thun Oversize Unisex',
                'image' => null,
                'price' => 220000,
                'sale_price' => 189000,
                'tag' => 'HOT',
                'description' => 'Áo thun form rộng unisex, chất liệu cotton 100%, phong cách streetwear.',
                'view_count' => 256,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Áo Sơ Mi (category_id = 2)
            [
                'name' => 'Áo Sơ Mi Nam Công Sở',
                'image' => null,
                'price' => 350000,
                'sale_price' => 299000,
                'tag' => 'NEW',
                'description' => 'Áo sơ mi nam công sở cao cấp, chất liệu kate mềm mại, không nhăn.',
                'view_count' => 89,
                'category_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Sơ Mi Nữ Dài Tay',
                'image' => null,
                'price' => 320000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Áo sơ mi nữ công sở, chất liệu lụa mềm mại, thiết kế sang trọng.',
                'view_count' => 143,
                'category_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Quần Jean (category_id = 3)
            [
                'name' => 'Quần Jean Nam Slim Fit',
                'image' => null,
                'price' => 450000,
                'sale_price' => 399000,
                'tag' => 'SALE',
                'description' => 'Quần jean nam dáng slim fit ôm vừa vặn, chất liệu denim co giãn nhẹ.',
                'view_count' => 156,
                'category_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quần Jean Nữ Ống Rộng',
                'image' => null,
                'price' => 420000,
                'sale_price' => 350000,
                'tag' => 'SALE',
                'description' => 'Quần jean nữ ống rộng trendy, chất liệu denim cao cấp.',
                'view_count' => 201,
                'category_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quần Jean Baggy Unisex',
                'image' => null,
                'price' => 480000,
                'sale_price' => 420000,
                'tag' => 'HOT',
                'description' => 'Quần jean baggy phong cách streetwear, chất liệu denim cao cấp.',
                'view_count' => 312,
                'category_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Quần Tây (category_id = 4)
            [
                'name' => 'Quần Kaki Nam Công Sở',
                'image' => null,
                'price' => 380000,
                'sale_price' => 320000,
                'tag' => null,
                'description' => 'Quần kaki nam form slim, chất liệu co giãn 4 chiều thoải mái.',
                'view_count' => 93,
                'category_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quần Tây Nữ Công Sở',
                'image' => null,
                'price' => 350000,
                'sale_price' => null,
                'tag' => 'NEW',
                'description' => 'Quần tây nữ công sở dáng suông, chất liệu co giãn nhẹ.',
                'view_count' => 87,
                'category_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Áo Khoác (category_id = 5)
            [
                'name' => 'Áo Khoác Jean Nam',
                'image' => null,
                'price' => 550000,
                'sale_price' => 480000,
                'tag' => 'HOT',
                'description' => 'Áo khoác jean nam phong cách vintage, chất liệu denim cao cấp.',
                'view_count' => 198,
                'category_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Hoodie Nỉ Unisex',
                'image' => null,
                'price' => 380000,
                'sale_price' => 320000,
                'tag' => 'NEW',
                'description' => 'Áo hoodie nỉ bông unisex, form rộng thoải mái, giữ ấm tốt.',
                'view_count' => 267,
                'category_id' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Váy (category_id = 6)
            [
                'name' => 'Váy Chữ A Nữ Công Sở',
                'image' => null,
                'price' => 320000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Váy chữ A nữ lịch sự, phù hợp môi trường công sở.',
                'view_count' => 142,
                'category_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Váy Maxi Dài Nữ',
                'image' => null,
                'price' => 450000,
                'sale_price' => 380000,
                'tag' => 'SALE',
                'description' => 'Váy maxi dài thanh lịch, chất liệu voan mềm mại.',
                'view_count' => 176,
                'category_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Đầm (category_id = 7)
            [
                'name' => 'Đầm Công Sở Nữ',
                'image' => null,
                'price' => 420000,
                'sale_price' => null,
                'tag' => 'NEW',
                'description' => 'Đầm công sở nữ thanh lịch, chất liệu cao cấp.',
                'view_count' => 134,
                'category_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Đầm Dạ Tiệc Sang Trọng',
                'image' => null,
                'price' => 680000,
                'sale_price' => 580000,
                'tag' => 'HOT',
                'description' => 'Đầm dạ tiệc thiết kế sang trọng, phù hợp sự kiện quan trọng.',
                'view_count' => 223,
                'category_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Áo Polo (category_id = 8)
            [
                'name' => 'Áo Polo Nam Cao Cấp',
                'image' => null,
                'price' => 280000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Áo polo nam chất liệu pique cao cấp, thấm hút mồ hôi tốt.',
                'view_count' => 67,
                'category_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Polo Nữ Thể Thao',
                'image' => null,
                'price' => 250000,
                'sale_price' => 199000,
                'tag' => 'SALE',
                'description' => 'Áo polo nữ thể thao, chất liệu thấm hút mồ hôi, co giãn tốt.',
                'view_count' => 98,
                'category_id' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Quần Short (category_id = 9)
            [
                'name' => 'Quần Short Jean Nam',
                'image' => null,
                'price' => 280000,
                'sale_price' => 220000,
                'tag' => 'SALE',
                'description' => 'Quần short jean nam phong cách năng động, chất liệu denim co giãn.',
                'view_count' => 156,
                'category_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quần Short Kaki Nữ',
                'image' => null,
                'price' => 250000,
                'sale_price' => null,
                'tag' => null,
                'description' => 'Quần short kaki nữ thời trang, chất liệu mềm mại thoáng mát.',
                'view_count' => 112,
                'category_id' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Áo Len (category_id = 10)
            [
                'name' => 'Áo Len Nam Cổ Tròn',
                'image' => null,
                'price' => 420000,
                'sale_price' => 350000,
                'tag' => 'HOT',
                'description' => 'Áo len nam dệt kim cổ tròn, giữ ấm tốt, chất liệu mềm mại.',
                'view_count' => 189,
                'category_id' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Áo Cardigan Nữ',
                'image' => null,
                'price' => 380000,
                'sale_price' => null,
                'tag' => 'NEW',
                'description' => 'Áo cardigan nữ phong cách hàn quốc, chất liệu len mềm mịn.',
                'view_count' => 201,
                'category_id' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('products')->insert($products);
    }
}
