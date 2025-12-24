<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['name' => 'Trắng', 'color_code' => '#FFFFFF', 'image' => 'colors/trang.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Đen', 'color_code' => '#000000', 'image' => 'colors/den.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Xám', 'color_code' => '#808080', 'image' => 'colors/xam.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Xanh Navy', 'color_code' => '#000080', 'image' => 'colors/xanh-navy.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Xanh Dương', 'color_code' => '#0000FF', 'image' => 'colors/xanh-duong.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Xanh Đậm', 'color_code' => '#191970', 'image' => 'colors/xanh-dam.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Be', 'color_code' => '#F5F5DC', 'image' => 'colors/be.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Hồng', 'color_code' => '#FFC0CB', 'image' => 'colors/hong.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Xanh Nhạt', 'color_code' => '#ADD8E6', 'image' => 'colors/xanh-nhat.jpg', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nâu', 'color_code' => '#A52A2A', 'image' => 'colors/nau.jpg', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('colors')->insert($colors);
    }
}
