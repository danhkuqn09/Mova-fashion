<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo đơn hàng
        $orders = [
            // Đơn hàng 1 - Đã hoàn thành
            [
                'id' => 1,
                'user_id' => 4, // Nguyễn Văn An
                'voucher_id' => 1, // WELCOME10
                'name' => 'Nguyễn Văn An',
                'email' => 'nguyenvana@gmail.com',
                'phone' => '0904567890',
                'address' => '123 Nguyễn Huệ, Quận 1, TP.HCM',
                'status' => 'completed',
                'original_total' => 548000,
                'discount_amount' => 54800,
                'final_total' => 493200,
                'payment_method' => 'COD',
                'note' => 'Giao giờ hành chính',
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(10),
            ],
            // Đơn hàng 2 - Đang giao
            [
                'id' => 2,
                'user_id' => 5, // Lê Thị Bích
                'voucher_id' => null,
                'name' => 'Lê Thị Bích',
                'email' => 'lethib@gmail.com',
                'phone' => '0905678901',
                'address' => '456 Lê Lợi, Quận 3, TP.HCM',
                'status' => 'shipping',
                'original_total' => 220000,
                'discount_amount' => 0,
                'final_total' => 220000,
                'payment_method' => 'Bank Transfer',
                'note' => null,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(1),
            ],
            // Đơn hàng 3 - Đã hoàn thành
            [
                'id' => 3,
                'user_id' => 6, // Phạm Văn C
                'voucher_id' => 2, // SUMMER20
                'name' => 'Phạm Văn C',
                'email' => 'phamvanc@gmail.com',
                'phone' => '0906789012',
                'address' => '789 Trần Hưng Đạo, Quận 5, TP.HCM',
                'status' => 'completed',
                'original_total' => 1169000,
                'discount_amount' => 233800,
                'final_total' => 935200,
                'payment_method' => 'COD',
                'note' => 'Kiểm tra hàng trước khi nhận',
                'created_at' => now()->subDays(20),
                'updated_at' => now()->subDays(15),
            ],
            // Đơn hàng 4 - Đang xử lý
            [
                'id' => 4,
                'user_id' => 7, // Hoàng Thị D
                'voucher_id' => null,
                'name' => 'Hoàng Thị D',
                'email' => 'hoangthid@gmail.com',
                'phone' => '0907890123',
                'address' => '321 Võ Văn Tần, Quận 3, TP.HCM',
                'status' => 'processing',
                'original_total' => 350000,
                'discount_amount' => 0,
                'final_total' => 350000,
                'payment_method' => 'E-Wallet',
                'note' => null,
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            // Đơn hàng 5 - Đã hoàn thành
            [
                'id' => 5,
                'user_id' => 8, // Vũ Văn E
                'voucher_id' => 4, // NEWUSER15
                'name' => 'Vũ Văn E',
                'email' => 'vuvane@gmail.com',
                'phone' => '0908901234',
                'address' => '654 Lý Thường Kiệt, Quận 10, TP.HCM',
                'status' => 'completed',
                'original_total' => 399000,
                'discount_amount' => 59850,
                'final_total' => 339150,
                'payment_method' => 'COD',
                'note' => null,
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(5),
            ],
        ];

        DB::table('orders')->insert($orders);

        // Tạo chi tiết đơn hàng (order_items)
        $orderItems = [
            // Order 1 items
            ['id' => 1, 'order_id' => 1, 'product_variant_id' => 5, 'quantity' => 2, 'price' => 149000, 'created_at' => now()->subDays(15), 'updated_at' => now()->subDays(15)],
            ['id' => 2, 'order_id' => 1, 'product_variant_id' => 21, 'quantity' => 1, 'price' => 250000, 'created_at' => now()->subDays(15), 'updated_at' => now()->subDays(15)],
            
            // Order 2 items
            ['id' => 3, 'order_id' => 2, 'product_variant_id' => 50, 'quantity' => 1, 'price' => 220000, 'created_at' => now()->subDays(3), 'updated_at' => now()->subDays(3)],
            
            // Order 3 items
            ['id' => 4, 'order_id' => 3, 'product_variant_id' => 33, 'quantity' => 1, 'price' => 399000, 'created_at' => now()->subDays(20), 'updated_at' => now()->subDays(20)],
            ['id' => 5, 'order_id' => 3, 'product_variant_id' => 62, 'quantity' => 1, 'price' => 350000, 'created_at' => now()->subDays(20), 'updated_at' => now()->subDays(20)],
            ['id' => 6, 'order_id' => 3, 'product_variant_id' => 85, 'quantity' => 1, 'price' => 420000, 'created_at' => now()->subDays(20), 'updated_at' => now()->subDays(20)],
            
            // Order 4 items
            ['id' => 7, 'order_id' => 4, 'product_variant_id' => 70, 'quantity' => 1, 'price' => 350000, 'created_at' => now()->subDays(1), 'updated_at' => now()->subDays(1)],
            
            // Order 5 items
            ['id' => 8, 'order_id' => 5, 'product_variant_id' => 10, 'quantity' => 1, 'price' => 399000, 'created_at' => now()->subDays(8), 'updated_at' => now()->subDays(8)],
        ];

        DB::table('order_items')->insert($orderItems);
    }
}
