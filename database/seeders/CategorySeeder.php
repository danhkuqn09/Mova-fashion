<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Áo Nam', 'image' => 'uploads/categories/ao-nam.jpg'],
            ['name' => 'Áo Nữ', 'image' => 'uploads/categories/ao-nu.jpg'],
            ['name' => 'Quần Nam', 'image' => 'uploads/categories/quan-nam.jpg'],
            ['name' => 'Quần Nữ', 'image' => 'uploads/categories/quan-nu.jpg'],
            ['name' => 'Váy', 'image' => 'uploads/categories/vay.jpg'],
            ['name' => 'Đầm', 'image' => 'uploads/categories/dam.jpg'],
            ['name' => 'Áo Khoác', 'image' => 'uploads/categories/ao-khoac.jpg'],
            ['name' => 'Phụ Kiện', 'image' => 'uploads/categories/phu-kien.jpg'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
