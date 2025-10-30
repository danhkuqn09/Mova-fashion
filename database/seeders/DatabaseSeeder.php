<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // BƯỚC 1: Tạo dữ liệu cơ bản
            UserSeeder::class,            // 1. Tạo users trước
            CategorySeeder::class,         // 2. Tạo categories
            VoucherSeeder::class,          // 3. Tạo vouchers
            
            // BƯỚC 2: Tạo sản phẩm
            ProductSeeder::class,          // 4. Tạo products (cần categories)
            ProductColorSeeder::class,     // 5. Tạo colors (cần products)
            ProductVariantSeeder::class,   // 6. Tạo variants (cần products + colors)
            
            // BƯỚC 3: Tạo đơn hàng và tương tác
            OrderSeeder::class,            // 7. Tạo orders + order_items (cần users, vouchers, variants)
            ReviewSeeder::class,           // 8. Tạo reviews (cần users, order_items)
            CommentSeeder::class,          // 9. Tạo comments (cần users, products)
            CartSeeder::class,             // 10. Tạo carts (cần users, variants)
            
            // BƯỚC 4: Tạo tin tức
            NewsSeeder::class,             // 11. Tạo news + news_details (cần users)
        ]);
    }
}
