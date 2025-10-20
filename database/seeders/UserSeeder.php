<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'username' => 'admin',
            'name' => 'Administrator',
            'email' => 'admin@mova.com',
            'phone' => '0901234567',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_blocked' => false,
            'image' => null,
        ]);

        // Test users
        User::create([
            'username' => 'user1',
            'name' => 'Nguyễn Văn A',
            'email' => 'user1@example.com',
            'phone' => '0912345678',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_blocked' => false,
        ]);

        User::create([
            'username' => 'user2',
            'name' => 'Trần Thị B',
            'email' => 'user2@example.com',
            'phone' => '0923456789',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_blocked' => false,
        ]);

        // Generate random users
        User::factory(10)->create();
    }
}
