<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\OrderItem;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $orderItems = OrderItem::whereHas('order', function ($query) {
            $query->whereIn('status', ['delivered']);
        })->get();

        if ($orderItems->isEmpty()) {
            $this->command->warn('No delivered order items found.');
            return;
        }

        $reviewTexts = [
            'Sản phẩm rất tốt, chất lượng như mô tả!',
            'Đóng gói cẩn thận, giao hàng nhanh.',
            'Chất liệu vải đẹp, form chuẩn.',
            'Giá hơi cao nhưng chất lượng xứng đáng.',
            'Màu sắc đẹp, đúng như hình.',
            'Shop phục vụ tận tình, sẽ ủng hộ tiếp.',
            'Sản phẩm ổn, đáng tiền.',
            'Hơi nhỏ so với size thông thường.',
            'Chất lượng tốt, giá cả hợp lý.',
            'Rất hài lòng với sản phẩm này!',
        ];

        // Tạo review cho 60% order items đã giao
        $reviewCount = (int)($orderItems->count() * 0.6);
        $selectedItems = $orderItems->random(min($reviewCount, $orderItems->count()));

        foreach ($selectedItems as $item) {
            Review::create([
                'user_id' => $item->order->user_id,
                'order_item_id' => $item->id,
                'rating' => rand(3, 5),
                'content' => fake()->randomElement($reviewTexts),
                'image' => fake()->boolean(30) ? 'uploads/reviews/review-' . rand(1, 10) . '.jpg' : null,
                'created_at' => fake()->dateTimeBetween($item->order->created_at, 'now'),
            ]);
        }

        $this->command->info('Created ' . Review::count() . ' reviews.');
    }
}
