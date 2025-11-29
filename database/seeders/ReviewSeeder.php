<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            // Review cho order_item 1
            ['order_item_id' => 1, 'rating' => 5, 'content' => 'Áo rất đẹp, chất liệu cotton mềm mại. Form dáng vừa vặn, đúng size. Shop giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop tiếp!', 'image' => 'reviews/review-1.jpg', 'created_at' => now()->subDays(12), 'updated_at' => now()->subDays(12)],
            
            ['order_item_id' => 2, 'rating' => 4, 'content' => 'Áo sơ mi đẹp, phù hợp mặc công sở. Chất vải hơi dày một chút nhưng không sao. Giá hợp lý.', 'image' => null, 'created_at' => now()->subDays(12), 'updated_at' => now()->subDays(12)],
            
            ['order_item_id' => 4, 'rating' => 5, 'content' => 'Quần jean chất lượng tuyệt vời! Form slim fit ôm đẹp, chất denim dày dặn. Màu xanh đậm rất đẹp, không phai màu sau khi giặt. Đáng tiền!', 'image' => 'reviews/review-2.jpg', 'created_at' => now()->subDays(16), 'updated_at' => now()->subDays(16)],
            
            ['order_item_id' => 5, 'rating' => 5, 'content' => 'Quần ống rộng rất trendy, mặc thoải mái. Chất liệu tốt, form dáng đẹp. Mình rất hài lòng!', 'image' => 'reviews/review-3.jpg', 'created_at' => now()->subDays(16), 'updated_at' => now()->subDays(16)],
            
            ['order_item_id' => 6, 'rating' => 4, 'content' => 'Túi đẹp, da PU mềm. Size vừa phải, đựng đồ được nhiều thứ. Khóa kéo hơi cứng một chút.', 'image' => null, 'created_at' => now()->subDays(16), 'updated_at' => now()->subDays(16)],
            
            ['order_item_id' => 8, 'rating' => 5, 'content' => 'Áo polo rất đẹp và sang trọng. Chất liệu pique thoáng mát, thấm hút mồ hôi tốt. Mặc đi chơi hoặc đi làm đều hợp. Giá cả hợp lý. 5 sao!', 'image' => 'reviews/review-4.jpg', 'created_at' => now()->subDays(6), 'updated_at' => now()->subDays(6)],
        ];

        DB::table('reviews')->insert($reviews);
    }
}
