<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            // Admin user
            [
                'username' => 'admin',
                'name' => 'Administrator',
                'email' => 'admin@movafashion.com',
                'phone' => '0901234567',
                'role' => 'admin',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/admin.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Staff users
            [
                'username' => 'staff01',
                'name' => 'Nguyễn Văn A',
                'email' => 'staff01@movafashion.com',
                'phone' => '0902345678',
                'role' => 'staff',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/staff01.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'staff02',
                'name' => 'Trần Thị B',
                'email' => 'staff02@movafashion.com',
                'phone' => '0903456789',
                'role' => 'staff',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/staff02.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Regular users
            [
                'username' => 'nguyenvana',
                'name' => 'Nguyễn Văn An',
                'email' => 'nguyenvana@gmail.com',
                'phone' => '0904567890',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/user01.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'lethib',
                'name' => 'Lê Thị Bích',
                'email' => 'lethib@gmail.com',
                'phone' => '0905678901',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/user02.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'phamvanc',
                'name' => 'Phạm Văn C',
                'email' => 'phamvanc@gmail.com',
                'phone' => '0906789012',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/user03.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'hoangthid',
                'name' => 'Hoàng Thị D',
                'email' => 'hoangthid@gmail.com',
                'phone' => '0907890123',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/user04.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'vuvane',
                'name' => 'Vũ Văn E',
                'email' => 'vuvane@gmail.com',
                'phone' => '0908901234',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/user05.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'dothif',
                'name' => 'Đỗ Thị F',
                'email' => 'dothif@gmail.com',
                'phone' => '0909012345',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/user06.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'buivang',
                'name' => 'Bùi Văn G',
                'email' => 'buivang@gmail.com',
                'phone' => '0910123456',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => 'users/user07.jpg',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'dangthih',
                'name' => 'Đặng Thị H',
                'email' => 'dangthih@gmail.com',
                'phone' => null, // User không có số điện thoại
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'image' => null, // User không có ảnh
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
