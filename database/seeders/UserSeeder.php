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
                'address' => '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
                'role' => 'admin',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
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
                'address' => '456 Đường Lê Lợi, Quận 1, TP.HCM',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'lethib',
                'name' => 'Lê Thị Bích',
                'email' => 'lethib@gmail.com',
                'phone' => '0905678901',
                'address' => '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'phamvanc',
                'name' => 'Phạm Văn C',
                'email' => 'phamvanc@gmail.com',
                'phone' => '0906789012',
                'address' => '321 Đường Võ Văn Tần, Quận 3, TP.HCM',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'hoangthid',
                'name' => 'Hoàng Thị D',
                'email' => 'hoangthid@gmail.com',
                'phone' => '0907890123',
                'address' => '654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'vuvane',
                'name' => 'Vũ Văn E',
                'email' => 'vuvane@gmail.com',
                'phone' => '0908901234',
                'address' => '147 Đường Hai Bà Trưng, Quận 1, TP.HCM',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'dothif',
                'name' => 'Đỗ Thị F',
                'email' => 'dothif@gmail.com',
                'phone' => '0909012345',
                'address' => '258 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'buivang',
                'name' => 'Bùi Văn G',
                'email' => 'buivang@gmail.com',
                'phone' => '0910123456',
                'address' => '369 Đường Phan Xích Long, Quận Phú Nhuận, TP.HCM',
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'dangthih',
                'name' => 'Đặng Thị H',
                'email' => 'dangthih@gmail.com',
                'phone' => null,
                'address' => null, // User chưa cập nhật địa chỉ
                'role' => 'user',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
