<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Basic data
            CategorySeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            VoucherSeeder::class,
            
            // Transactional data
            OrderSeeder::class,
            ReviewSeeder::class,
            CommentSeeder::class,
            CartSeeder::class,
            NewsSeeder::class,
        ]);
    }
}
