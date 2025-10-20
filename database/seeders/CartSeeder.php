<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductColor;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $products = Product::with('colors.sizes')->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('No users or products found.');
            return;
        }

        // Tạo giỏ hàng cho 50% users
        $usersWithCart = $users->random((int)($users->count() * 0.5));

        foreach ($usersWithCart as $user) {
            $itemCount = rand(1, 5);
            $cartProducts = $products->random(min($itemCount, $products->count()));

            foreach ($cartProducts as $product) {
                $color = $product->colors->isNotEmpty() ? $product->colors->random() : null;
                $sizes = $color ? $color->sizes : collect();
                $size = $sizes->isNotEmpty() ? $sizes->random()->size : null;

                Cart::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'color_id' => $color?->id,
                    'size' => $size,
                    'quantity' => rand(1, 3),
                ]);
            }
        }

        $this->command->info('Created ' . Cart::count() . ' cart items.');
    }
}
