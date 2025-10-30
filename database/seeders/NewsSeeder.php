<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo tin tức
        $newsItems = [
            [
                'id' => 1,
                'user_id' => 1, // Admin user
                'title' => 'Xu hướng thời trang Thu Đông 2025',
                'thumbnail' => 'news/thu-dong-2025.jpg',
                'summary' => 'Khám phá những xu hướng thời trang nổi bật cho mùa Thu Đông năm nay với những gam màu ấm áp và chất liệu cao cấp.',
                'status' => 'published',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
            [
                'id' => 2,
                'user_id' => 1,
                'title' => 'Cách phối đồ công sở lịch sự cho phái đẹp',
                'thumbnail' => 'news/phoi-do-cong-so.jpg',
                'summary' => 'Hướng dẫn chi tiết cách phối đồ công sở lịch sự nhưng vẫn thời trang và năng động cho các nàng công sở.',
                'status' => 'published',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'id' => 3,
                'user_id' => 1,
                'title' => 'Top 10 item thời trang nam must-have 2025',
                'thumbnail' => 'news/top-10-nam.jpg',
                'summary' => 'Điểm danh 10 món đồ thời trang nam không thể thiếu trong tủ đồ của các chàng trai hiện đại.',
                'status' => 'published',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'id' => 4,
                'user_id' => 1,
                'title' => 'Bí quyết chọn size quần áo chuẩn không cần chỉnh sửa',
                'thumbnail' => 'news/chon-size.jpg',
                'summary' => 'Hướng dẫn cách đo và chọn size quần áo phù hợp với từng vóc dáng để có được bộ trang phục ưng ý nhất.',
                'status' => 'published',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'id' => 5,
                'user_id' => 1,
                'title' => 'Chăm sóc và bảo quản quần áo đúng cách',
                'thumbnail' => 'news/bao-quan-do.jpg',
                'summary' => 'Những mẹo nhỏ giúp bạn chăm sóc và bảo quản quần áo luôn như mới, kéo dài tuổi thọ cho trang phục yêu thích.',
                'status' => 'draft',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
        ];

        DB::table('news')->insert($newsItems);

        // Tạo chi tiết tin tức
        $newsDetails = [
            // Chi tiết cho tin tức 1
            [
                'news_id' => 1,
                'content' => '<h2>Gam màu chủ đạo</h2><p>Mùa Thu Đông năm nay, các gam màu ấm áp như nâu, be, cam đất... đang rất được ưa chuộng. Đặc biệt là tone màu trung tính giúp bạn dễ dàng mix-match.</p>',
                'image' => 'news/details/thu-dong-gam-mau.jpg',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
            [
                'news_id' => 1,
                'content' => '<h2>Chất liệu nổi bật</h2><p>Len, nỉ, tweed và các chất liệu dày dặn, giữ ấm tốt đang là lựa chọn hàng đầu. Đặc biệt là những thiết kế oversize tạo cảm giác thoải mái.</p>',
                'image' => 'news/details/thu-dong-chat-lieu.jpg',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
            
            // Chi tiết cho tin tức 2
            [
                'news_id' => 2,
                'content' => '<h2>Set đồ công sở cơ bản</h2><p>Một bộ vest form chuẩn, áo sơ mi trắng và quần tây là combo không bao giờ lỗi thời cho môi trường công sở.</p>',
                'image' => 'news/details/cong-so-co-ban.jpg',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'news_id' => 2,
                'content' => '<h2>Phụ kiện điểm nhấn</h2><p>Một chiếc túi xách cao cấp, giày cao gót thanh lịch hoặc khăn lụa sẽ giúp tổng thể trang phục thêm phần sang trọng và chuyên nghiệp.</p>',
                'image' => 'news/details/cong-so-phu-kien.jpg',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            
            // Chi tiết cho tin tức 3
            [
                'news_id' => 3,
                'content' => '<h2>1. Áo Sơ Mi Trắng</h2><p>Món đồ cơ bản nhất mà mọi quý ông nên có. Dễ phối với mọi trang phục từ casual đến formal.</p>',
                'image' => 'news/details/top10-somi.jpg',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'news_id' => 3,
                'content' => '<h2>2. Quần Jean Đen</h2><p>Quần jean đen form slim fit là lựa chọn hoàn hảo, dễ phối với áo thun, áo sơ mi hay áo khoác.</p>',
                'image' => 'news/details/top10-jean.jpg',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
        ];

        DB::table('new_details')->insert($newsDetails);
    }
}
