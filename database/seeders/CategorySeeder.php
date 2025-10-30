<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Danh mục cha
            [
                'id' => 1,
                'name' => 'Thời Trang Nam',
                'image' => 'categories/thoi-trang-nam.jpg',
                'description' => 'Bộ sưu tập thời trang nam đa dạng và phong cách',
                'is_active' => true,
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Thời Trang Nữ',
                'image' => 'categories/thoi-trang-nu.jpg',
                'description' => 'Bộ sưu tập thời trang nữ hiện đại và thời thượng',
                'is_active' => true,
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Phụ Kiện',
                'image' => 'categories/phu-kien.jpg',
                'description' => 'Các phụ kiện thời trang cao cấp',
                'is_active' => true,
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Danh mục con của Thời Trang Nam
            [
                'id' => 4,
                'name' => 'Áo Nam',
                'image' => 'categories/ao-nam.jpg',
                'description' => 'Áo thun, áo sơ mi, áo polo nam',
                'is_active' => true,
                'parent_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'name' => 'Quần Nam',
                'image' => 'categories/quan-nam.jpg',
                'description' => 'Quần jean, quần kaki, quần tây nam',
                'is_active' => true,
                'parent_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Danh mục con của Thời Trang Nữ
            [
                'id' => 6,
                'name' => 'Áo Nữ',
                'image' => 'categories/ao-nu.jpg',
                'description' => 'Áo kiểu, áo thun, áo croptop nữ',
                'is_active' => true,
                'parent_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'name' => 'Quần Nữ',
                'image' => 'categories/quan-nu.jpg',
                'description' => 'Quần jean, váy, quần tây nữ',
                'is_active' => true,
                'parent_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Danh mục con của Phụ Kiện
            [
                'id' => 8,
                'name' => 'Túi Xách',
                'image' => 'categories/tui-xach.jpg',
                'description' => 'Túi xách, balo, ví thời trang',
                'is_active' => true,
                'parent_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'name' => 'Giày Dép',
                'image' => 'categories/giay-dep.jpg',
                'description' => 'Giày thể thao, giày tây, dép',
                'is_active' => true,
                'parent_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}
