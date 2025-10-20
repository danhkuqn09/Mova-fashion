<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\User;
use App\Models\Product;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('No users or products found.');
            return;
        }

        $commentTexts = [
            'Sản phẩm có size nào phù hợp với người cao 1m65 không shop?',
            'Cho em hỏi còn màu xanh navy không ạ?',
            'Vải có dày không shop?',
            'Sản phẩm này có co giãn không ạ?',
            'Giặt nhiều có phai màu không shop?',
            'Khi nào có hàng về ạ?',
            'Cho em xin bảng size chi tiết được không?',
            'Đặt hàng bao lâu thì nhận được ạ?',
            'Sản phẩm có giống ảnh không shop?',
            'Có chương trình giảm giá không ạ?',
        ];

        // Tạo 50 comments ngẫu nhiên
        for ($i = 0; $i < 50; $i++) {
            Comment::create([
                'user_id' => $users->random()->id,
                'product_id' => $products->random()->id,
                'content' => fake()->randomElement($commentTexts),
                'image' => fake()->boolean(20) ? 'uploads/comments/comment-' . rand(1, 5) . '.jpg' : null,
                'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
            ]);
        }

        $this->command->info('Created ' . Comment::count() . ' comments.');
    }
}
