<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductColor;
use App\Models\ProductVariant;

class ProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy tất cả products
        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->info('No products found. Please run ProductSeeder first.');
            return;
        }

        $this->command->info('Creating product variants with pricing...');

        foreach ($products as $product) {
            // Lấy colors của product này
            $colors = ProductColor::where('product_id', $product->id)->get();
            
            if ($colors->isEmpty()) {
                continue;
            }

            // Sizes available based on product type
            $sizes = $this->getSizesForProduct($product);
            
            foreach ($colors as $color) {
                // Mỗi màu có tất cả sizes hoặc random 3-5 sizes
                $availableSizes = count($sizes) <= 5 
                    ? $sizes 
                    : collect($sizes)->random(rand(3, 5))->toArray();
                
                foreach ($availableSizes as $size) {
                    // Generate pricing logic
                    $pricingData = $this->generateVariantPricing($product, $size, $color->name);
                    
                    ProductVariant::create([
                        'color_id' => $color->id,
                        'size' => $size,
                        'price' => $pricingData['price'],
                        'sale_price' => $pricingData['sale_price'],
                        'quantity' => rand(5, 50),
                        'image' => null,
                    ]);
                }
            }
        }
        
        $variantCount = ProductVariant::count();
        $this->command->info("ProductVariant seeded successfully! Created {$variantCount} variants.");
    }

    /**
     * Get appropriate sizes based on product category
     * Size options: S, M, L, XL, XXL hoặc One Size cho một số sản phẩm
     */
    private function getSizesForProduct($product)
    {
        $productName = strtolower($product->name);
        
        // Một số sản phẩm chỉ có 1 size (túi, ví, phụ kiện - nếu có trong tương lai)
        if (str_contains($productName, 'túi') || str_contains($productName, 'ví') || 
            str_contains($productName, 'mũ') || str_contains($productName, 'khăn') ||
            str_contains($productName, 'thắt lưng') || str_contains($productName, 'dây nit')) {
            return ['One Size'];
        }
        
        // Tất cả quần áo khác: S, M, L, XL, XXL
        return ['S', 'M', 'L', 'XL', 'XXL'];
    }

    /**
     * Generate variant pricing based on size and color
     * Admin sẽ tự chỉnh giá các size trong product admin nên seeder không tạo giá theo size
     */
    private function generateVariantPricing($product, $size, $colorName)
    {
        // Tất cả variants đều dùng giá gốc của product
        // Admin sẽ tự cập nhật giá cho từng size nếu cần
        return [
            'price' => null,      // Dùng giá product
            'sale_price' => null  // Dùng sale_price của product
        ];
    }
}
