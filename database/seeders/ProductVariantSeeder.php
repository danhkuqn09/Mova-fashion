<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $variants = [];
        $sizes = ['S', 'M', 'L', 'XL'];
        
        // Tạo variants cho sản phẩm 1 (Áo Thun Nam - 3 màu)
        foreach ([1, 2, 3] as $colorId) {
            foreach ($sizes as $size) {
                $variants[] = [
                    'product_id' => 1,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-1-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 2 (Áo Sơ Mi - 2 màu)
        foreach ([4, 5] as $colorId) {
            foreach ($sizes as $size) {
                $variants[] = [
                    'product_id' => 2,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-2-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 3 (Áo Polo - 2 màu)
        foreach ([6, 7] as $colorId) {
            foreach ($sizes as $size) {
                $variants[] = [
                    'product_id' => 3,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-3-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 4 (Quần Jean Nam - 2 màu)
        $pantSizes = ['29', '30', '31', '32', '33'];
        foreach ([8, 9] as $colorId) {
            foreach ($pantSizes as $size) {
                $variants[] = [
                    'product_id' => 4,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-4-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 5 (Quần Kaki - 2 màu)
        foreach ([10, 11] as $colorId) {
            foreach ($pantSizes as $size) {
                $variants[] = [
                    'product_id' => 5,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-5-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 6 (Áo Kiểu Nữ - 2 màu)
        foreach ([12, 13] as $colorId) {
            foreach ($sizes as $size) {
                $variants[] = [
                    'product_id' => 6,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-6-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 7 (Áo Croptop - 2 màu)
        foreach ([14, 15] as $colorId) {
            foreach ($sizes as $size) {
                $variants[] = [
                    'product_id' => 7,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-7-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 8 (Quần Jean Nữ - 2 màu)
        $womenPantSizes = ['26', '27', '28', '29', '30'];
        foreach ([16, 17] as $colorId) {
            foreach ($womenPantSizes as $size) {
                $variants[] = [
                    'product_id' => 8,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-8-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 9 (Váy Chữ A - 2 màu)
        foreach ([18, 19] as $colorId) {
            foreach ($sizes as $size) {
                $variants[] = [
                    'product_id' => 9,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-9-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Tạo variants cho sản phẩm 10 (Túi Xách - 2 màu, 1 size)
        foreach ([20, 21] as $colorId) {
            $variants[] = [
                'product_id' => 10,
                'color_id' => $colorId,
                'size' => 'One Size',
                'quantity' => rand(10, 50),
                'image' => "variants/product-10-color-{$colorId}.jpg",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Tạo variants cho sản phẩm 11 (Thắt Lưng - 2 màu)
        $beltSizes = ['95cm', '100cm', '105cm', '110cm'];
        foreach ([22, 23] as $colorId) {
            foreach ($beltSizes as $size) {
                $variants[] = [
                    'product_id' => 11,
                    'color_id' => $colorId,
                    'size' => $size,
                    'quantity' => rand(10, 50),
                    'image' => "variants/product-11-color-{$colorId}-{$size}.jpg",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('product_variants')->insert($variants);
    }
}
