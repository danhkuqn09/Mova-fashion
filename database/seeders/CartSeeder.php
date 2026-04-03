<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carts = [
            // Giỏ hàng của user 3 (Lê Thị Bích)
            ['user_id' => 3, 'product_variant_id' => 2, 'quantity' => 1, 'created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2)],
            ['user_id' => 3, 'product_variant_id' => 58, 'quantity' => 2, 'created_at' => now()->subDays(1), 'updated_at' => now()->subDays(1)],
            
            // Giỏ hàng của user 5 (Hoàng Thị D)
            ['user_id' => 5, 'product_variant_id' => 15, 'quantity' => 1, 'created_at' => now()->subHours(12), 'updated_at' => now()->subHours(12)],
            ['user_id' => 5, 'product_variant_id' => 42, 'quantity' => 1, 'created_at' => now()->subHours(6), 'updated_at' => now()->subHours(6)],
            
            // Giỏ hàng của user 7 (Đỗ Thị F)
            ['user_id' => 7, 'product_variant_id' => 28, 'quantity' => 1, 'created_at' => now()->subDays(3), 'updated_at' => now()->subDays(3)],
            ['user_id' => 7, 'product_variant_id' => 75, 'quantity' => 1, 'created_at' => now()->subDays(1), 'updated_at' => now()->subDays(1)],
            ['user_id' => 7, 'product_variant_id' => 85, 'quantity' => 1, 'created_at' => now()->subHours(8), 'updated_at' => now()->subHours(8)],
            
            // Giỏ hàng của user 8 (Bùi Văn G)
            ['user_id' => 8, 'product_variant_id' => 6, 'quantity' => 3, 'created_at' => now()->subDays(1), 'updated_at' => now()->subHours(2)],
            
            // Giỏ hàng của user 9 (Đặng Thị H)
            ['user_id' => 9, 'product_variant_id' => 52, 'quantity' => 1, 'created_at' => now()->subHours(4), 'updated_at' => now()->subHours(4)],
            ['user_id' => 9, 'product_variant_id' => 64, 'quantity' => 1, 'created_at' => now()->subHours(3), 'updated_at' => now()->subHours(3)],
        ];

        DB::table('carts')->insert($carts);
    }
}
