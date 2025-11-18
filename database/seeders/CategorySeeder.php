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
            [
                'id' => 1,
                'name' => 'Áo Thun',
                'image' => 'categories/ao-thun.jpg',
                'description' => 'Áo thun nam nữ, áo thun basic, áo thun form rộng',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Áo Sơ Mi',
                'image' => 'categories/ao-somi.jpg',
                'description' => 'Áo sơ mi công sở, áo sơ mi casual, áo sơ mi kẻ sọc',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Quần Jean',
                'image' => 'categories/quan-jean.jpg',
                'description' => 'Quần jean nam nữ, quần jean skinny, quần jean baggy',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'Quần Tây',
                'image' => 'categories/quan-tay.jpg',
                'description' => 'Quần tây công sở, quần tây âu, quần tây nữ',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 5,
                'name' => 'Áo Khoác',
                'image' => 'categories/ao-khoac.jpg',
                'description' => 'Áo khoác jean, áo khoác da, áo khoác dù, áo blazer',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 6,
                'name' => 'Váy',
                'image' => 'categories/vay.jpg',
                'description' => 'Váy công sở, váy dạ hội, váy suông, váy xòe',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 7,
                'name' => 'Đầm',
                'image' => 'categories/dam.jpg',
                'description' => 'Đầm công sở, đầm dạ tiệc, đầm maxi, đầm body',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 8,
                'name' => 'Áo Polo',
                'image' => 'categories/ao-polo.jpg',
                'description' => 'Áo polo nam, áo polo nữ, áo polo thể thao',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 9,
                'name' => 'Quần Short',
                'image' => 'categories/quan-short.jpg',
                'description' => 'Quần short jean, quần short kaki, quần short thể thao',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 10,
                'name' => 'Áo Len',
                'image' => 'categories/ao-len.jpg',
                'description' => 'Áo len dệt kim, áo len cổ lọ, áo cardigan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}
