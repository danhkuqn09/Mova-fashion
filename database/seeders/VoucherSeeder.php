<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vouchers = [
            [
                'code' => 'WELCOME10',
                'discount_percent' => 10,
                'quantity' => 100,
                'min_total' => 200000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'SUMMER20',
                'discount_percent' => 20,
                'quantity' => 50,
                'min_total' => 500000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'FLASH30',
                'discount_percent' => 30,
                'quantity' => 20,
                'min_total' => 1000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'NEWUSER15',
                'discount_percent' => 15,
                'quantity' => 200,
                'min_total' => 300000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'MEGA50',
                'discount_percent' => 50,
                'quantity' => 10,
                'min_total' => 2000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('vouchers')->insert($vouchers);
    }
}
