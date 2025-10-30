<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comments = [
            // Comments cho sản phẩm 1 (Áo Thun Nam)
            ['user_id' => 5, 'product_id' => 1, 'content' => 'Cho mình hỏi áo này có co giãn không ạ?', 'image' => null, 'created_at' => now()->subDays(5), 'updated_at' => now()->subDays(5)],
            ['user_id' => 7, 'product_id' => 1, 'content' => 'Áo đẹp quá! Mình cao 1m70 nặng 65kg nên mặc size nào vừa ạ?', 'image' => null, 'created_at' => now()->subDays(4), 'updated_at' => now()->subDays(4)],
            
            // Comments cho sản phẩm 4 (Quần Jean Nam)
            ['user_id' => 8, 'product_id' => 4, 'content' => 'Shop cho hỏi quần này có bị phai màu khi giặt không?', 'image' => null, 'created_at' => now()->subDays(6), 'updated_at' => now()->subDays(6)],
            
            // Comments cho sản phẩm 6 (Áo Kiểu Nữ)
            ['user_id' => 9, 'product_id' => 6, 'content' => 'Áo này có thêm màu xanh không shop?', 'image' => null, 'created_at' => now()->subDays(3), 'updated_at' => now()->subDays(3)],
            ['user_id' => 10, 'product_id' => 6, 'content' => 'Chất vải có mỏng không ạ? Mình sợ mặc xuyên thấu', 'image' => null, 'created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2)],
            
            // Comments cho sản phẩm 8 (Quần Jean Nữ)
            ['user_id' => 11, 'product_id' => 8, 'content' => 'Quần này mặc có thoải mái không shop? Có co giãn không?', 'image' => null, 'created_at' => now()->subDays(7), 'updated_at' => now()->subDays(7)],
            
            // Comments cho sản phẩm 10 (Túi Xách)
            ['user_id' => 5, 'product_id' => 10, 'content' => 'Túi có chống nước không ạ?', 'image' => null, 'created_at' => now()->subDays(4), 'updated_at' => now()->subDays(4)],
            ['user_id' => 6, 'product_id' => 10, 'content' => 'Túi có mấy ngăn vậy shop?', 'image' => null, 'created_at' => now()->subDays(3), 'updated_at' => now()->subDays(3)],
        ];

        DB::table('comments')->insert($comments);
    }
}
