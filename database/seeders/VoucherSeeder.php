<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Voucher;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        $vouchers = [
            [
                'code' => 'SUMMER2025',
                'discount_percent' => 10,
                'quantity' => 100,
                'min_total' => 200000,
            ],
            [
                'code' => 'WELCOME20',
                'discount_percent' => 20,
                'quantity' => 50,
                'min_total' => 500000,
            ],
            [
                'code' => 'FLASH50',
                'discount_percent' => 50,
                'quantity' => 20,
                'min_total' => 1000000,
            ],
            [
                'code' => 'NEWYEAR30',
                'discount_percent' => 30,
                'quantity' => 80,
                'min_total' => 300000,
            ],
            [
                'code' => 'FREESHIP',
                'discount_percent' => 5,
                'quantity' => 200,
                'min_total' => 0,
            ],
        ];

        foreach ($vouchers as $voucher) {
            Voucher::create($voucher);
        }
    }
}
