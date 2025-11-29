<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            // Màu cho Áo Thun Nam Basic Trắng (product_id = 1)
            ['id' => 1, 'product_id' => 1, 'color_name' => 'Trắng', 'color_code' => '#FFFFFF', 'image' => 'products/ao-thun-trang.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'product_id' => 1, 'color_name' => 'Đen', 'color_code' => '#000000', 'image' => 'products/ao-thun-den.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'product_id' => 1, 'color_name' => 'Xám', 'color_code' => '#808080', 'image' => 'products/ao-thun-xam.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Áo Sơ Mi Nam (product_id = 2)
            ['id' => 4, 'product_id' => 2, 'color_name' => 'Trắng', 'color_code' => '#FFFFFF', 'image' => 'products/ao-somi-trang.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'product_id' => 2, 'color_name' => 'Xanh Navy', 'color_code' => '#000080', 'image' => 'products/ao-somi-xanh-navy.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Áo Polo Nam (product_id = 3)
            ['id' => 6, 'product_id' => 3, 'color_name' => 'Đen', 'color_code' => '#000000', 'image' => 'products/ao-polo-den.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'product_id' => 3, 'color_name' => 'Xanh Dương', 'color_code' => '#0000FF', 'image' => 'products/ao-polo-xanh-duong.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Quần Jean Nam (product_id = 4)
            ['id' => 8, 'product_id' => 4, 'color_name' => 'Xanh Đậm', 'color_code' => '#191970', 'image' => 'products/quan-jean-xanh-dam.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'product_id' => 4, 'color_name' => 'Đen', 'color_code' => '#000000', 'image' => 'products/quan-jean-den.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Quần Kaki Nam (product_id = 5)
            ['id' => 10, 'product_id' => 5, 'color_name' => 'Be', 'color_code' => '#F5F5DC', 'image' => 'products/quan-kaki-be.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'product_id' => 5, 'color_name' => 'Xám', 'color_code' => '#808080', 'image' => 'products/quan-kaki-xam.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Áo Kiểu Nữ (product_id = 6)
            ['id' => 12, 'product_id' => 6, 'color_name' => 'Hồng', 'color_code' => '#FFC0CB', 'image' => 'products/ao-kieu-hong.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'product_id' => 6, 'color_name' => 'Trắng', 'color_code' => '#FFFFFF', 'image' => 'products/ao-kieu-trang.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Áo Croptop (product_id = 7)
            ['id' => 14, 'product_id' => 7, 'color_name' => 'Đen', 'color_code' => '#000000', 'image' => 'products/ao-croptop-den.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 15, 'product_id' => 7, 'color_name' => 'Trắng', 'color_code' => '#FFFFFF', 'image' => 'products/ao-croptop-trang.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Quần Jean Nữ (product_id = 8)
            ['id' => 16, 'product_id' => 8, 'color_name' => 'Xanh Nhạt', 'color_code' => '#ADD8E6', 'image' => 'products/quan-jean-nu-xanh-nhat.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 17, 'product_id' => 8, 'color_name' => 'Trắng', 'color_code' => '#FFFFFF', 'image' => 'products/quan-jean-nu-trang.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Váy Chữ A (product_id = 9)
            ['id' => 18, 'product_id' => 9, 'color_name' => 'Đen', 'color_code' => '#000000', 'image' => 'products/vay-chu-a-den.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 19, 'product_id' => 9, 'color_name' => 'Xanh Navy', 'color_code' => '#000080', 'image' => 'products/vay-chu-a-xanh-navy.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Túi Xách Nữ (product_id = 10)
            ['id' => 20, 'product_id' => 10, 'color_name' => 'Đen', 'color_code' => '#000000', 'image' => 'products/tui-xach-den.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 21, 'product_id' => 10, 'color_name' => 'Nâu', 'color_code' => '#A52A2A', 'image' => 'products/tui-xach-nau.jpg', 'created_at' => now(), 'updated_at' => now()],
            
            // Màu cho Thắt Lưng Nam (product_id = 11)
            ['id' => 22, 'product_id' => 11, 'color_name' => 'Đen', 'color_code' => '#000000', 'image' => 'products/that-lung-den.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 23, 'product_id' => 11, 'color_name' => 'Nâu', 'color_code' => '#A52A2A', 'image' => 'products/that-lung-nau.jpg', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('product_colors')->insert($colors);
    }
}
