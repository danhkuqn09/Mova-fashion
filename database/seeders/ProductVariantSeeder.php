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
                        'product_id' => $product->id,
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
     */
    private function getSizesForProduct($product)
    {
        $productName = strtolower($product->name);
        
        // Quần nam (29-34)
        if (str_contains($productName, 'quần') && 
            (str_contains($productName, 'nam') || str_contains($productName, 'jean') || str_contains($productName, 'kaki'))) {
            return ['29', '30', '31', '32', '33', '34'];
        }
        
        // Quần nữ (26-31)
        if (str_contains($productName, 'quần') && str_contains($productName, 'nữ')) {
            return ['26', '27', '28', '29', '30', '31'];
        }
        
        // Thắt lưng (cm)
        if (str_contains($productName, 'thắt lưng') || str_contains($productName, 'dây nit')) {
            return ['95cm', '100cm', '105cm', '110cm'];
        }
        
        // Túi xách, ví, phụ kiện (one size)
        if (str_contains($productName, 'túi') || str_contains($productName, 'ví') || 
            str_contains($productName, 'mũ') || str_contains($productName, 'khăn')) {
            return ['One Size'];
        }
        
        // Mặc định: Áo, váy, đầm (S-XXL)
        return ['S', 'M', 'L', 'XL', 'XXL'];
    }

    /**
     * Generate variant pricing based on size and color
     */
    private function generateVariantPricing($product, $size, $colorName)
    {
        $basePrice = $product->price;
        $baseSalePrice = $product->sale_price;
        
        // Size multipliers
        $sizeMultipliers = [
            'S' => 1.0,
            'M' => 1.0,
            'L' => 1.05,      // +5%
            'XL' => 1.10,     // +10%
            'XXL' => 1.15,    // +15%
            // Pants sizes
            '26' => 1.0, '27' => 1.0, '28' => 1.0,
            '29' => 1.0, '30' => 1.0, '31' => 1.0,
            '32' => 1.05, '33' => 1.05, '34' => 1.05,
            // Belt sizes
            '95cm' => 1.0, '100cm' => 1.0, '105cm' => 1.02, '110cm' => 1.02,
            // One size
            'One Size' => 1.0,
        ];
        
        // Color premiums (màu đặc biệt)
        $colorPremiums = [
            'Đỏ' => 1.03,      // +3%
            'Hồng' => 1.04,    // +4%
            'Đen' => 1.02,     // +2%
            'Trắng' => 1.0,
            'Xanh Navy' => 1.02,
            'Xanh Dương' => 1.01,
            'Vàng' => 1.03,
            'Cam' => 1.02,
            'Xám' => 1.0,
            'Be' => 1.01,
        ];
        
        $sizeMultiplier = $sizeMultipliers[$size] ?? 1.0;
        $colorMultiplier = $colorPremiums[$colorName] ?? 1.0;
        
        // Chỉ variant có size lớn (L/XL/XXL) hoặc màu đặc biệt mới có giá riêng
        $hasCustomPrice = ($sizeMultiplier > 1.0 || $colorMultiplier > 1.0);
        
        if ($hasCustomPrice) {
            $variantPrice = round($basePrice * $sizeMultiplier * $colorMultiplier, -3); // Làm tròn đến hàng nghìn
            
            // 40% variants có sale_price riêng
            if (rand(1, 100) <= 40) {
                $discountPercent = rand(10, 30) / 100;
                $variantSalePrice = round($variantPrice * (1 - $discountPercent), -3);
                
                return [
                    'price' => $variantPrice,
                    'sale_price' => $variantSalePrice
                ];
            }
            
            return [
                'price' => $variantPrice,
                'sale_price' => null
            ];
        } else {
            // Variant size nhỏ/trung bình và màu thường → dùng giá product
            // 20% chance có sale_price riêng (thêm giảm giá)
            if ($baseSalePrice && rand(1, 100) <= 20) {
                $extraDiscount = rand(5, 10) / 100;
                $variantSalePrice = round($baseSalePrice * (1 - $extraDiscount), -3);
                
                return [
                    'price' => null,  // Dùng giá product
                    'sale_price' => $variantSalePrice
                ];
            }
            
            return [
                'price' => null,      // Dùng giá product
                'sale_price' => null  // Dùng sale_price của product
            ];
        }
    }
}
