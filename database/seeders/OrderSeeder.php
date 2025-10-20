<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductColor;
use App\Models\Voucher;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $products = Product::with('colors')->get();
        $vouchers = Voucher::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('No users or products found. Please run UserSeeder and ProductSeeder first.');
            return;
        }

        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        // Tạo 30 đơn hàng
        for ($i = 0; $i < 30; $i++) {
            $user = $users->random();
            $useVoucher = fake()->boolean(40);
            $voucher = $useVoucher && $vouchers->isNotEmpty() ? $vouchers->random() : null;

            // Tính tổng giá
            $itemCount = rand(1, 4);
            $orderProducts = $products->random($itemCount);
            $totalPrice = 0;

            foreach ($orderProducts as $product) {
                $price = $product->sale_price ?? $product->price;
                $quantity = rand(1, 3);
                $totalPrice += $price * $quantity;
            }

            // Áp dụng voucher
            $discountAmount = 0;
            $voucherCode = null;
            if ($voucher && $totalPrice >= $voucher->min_total) {
                $discountAmount = ($totalPrice * $voucher->discount_percent) / 100;
                $voucherCode = $voucher->code;
            }

            $order = Order::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '09' . fake()->numerify('########'),
                'address' => fake()->address(),
                'total_price' => $totalPrice - $discountAmount,
                'status' => fake()->randomElement($statuses),
                'voucher_code' => $voucherCode,
                'discount_amount' => $discountAmount,
                'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
            ]);

            // Tạo order items
            foreach ($orderProducts as $product) {
                $color = $product->colors->isNotEmpty() ? $product->colors->random() : null;
                $sizes = $color ? $color->sizes : collect();
                $size = $sizes->isNotEmpty() ? $sizes->random()->size : null;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'color_id' => $color?->id,
                    'size' => $size,
                    'quantity' => rand(1, 3),
                    'price' => $product->sale_price ?? $product->price,
                ]);
            }
        }

        $this->command->info('Created ' . Order::count() . ' orders with items.');
    }
}
