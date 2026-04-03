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
        // Tạo tin tức với content HTML đầy đủ
        $newsItems = [
            [
                'id' => 1,
                'user_id' => 1, // Admin user
                'title' => 'Xu hướng thời trang Thu Đông 2025',
                'thumbnail' => 'news/thu-dong-2025.jpg',
                'summary' => 'Khám phá những xu hướng thời trang nổi bật cho mùa Thu Đông năm nay với những gam màu ấm áp và chất liệu cao cấp.',
                'content' => '
                    <h2>Gam màu chủ đạo</h2>
                    <p>Mùa Thu Đông năm nay, các gam màu ấm áp như nâu, be, cam đất... đang rất được ưa chuộng. Đặc biệt là tone màu trung tính giúp bạn dễ dàng mix-match.</p>
                    <img src="/storage/news/details/thu-dong-gam-mau.jpg" alt="Gam màu Thu Đông" style="width: 100%; margin: 20px 0;">
                    
                    <h2>Chất liệu nổi bật</h2>
                    <p>Len, nỉ, tweed và các chất liệu dày dặn, giữ ấm tốt đang là lựa chọn hàng đầu. Đặc biệt là những thiết kế oversize tạo cảm giác thoải mái.</p>
                    <img src="/storage/news/details/thu-dong-chat-lieu.jpg" alt="Chất liệu Thu Đông" style="width: 100%; margin: 20px 0;">
                    
                    <h2>Phong cách layering</h2>
                    <p>Nghệ thuật kết hợp nhiều lớp trang phục không chỉ giúp giữ ấm mà còn tạo nên những outfit độc đáo và thời thượng.</p>
                ',
                'status' => 'published',
                'view_count' => 150,
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
            [
                'id' => 2,
                'user_id' => 1,
                'title' => 'Cách phối đồ công sở lịch sự cho phái đẹp',
                'thumbnail' => 'news/phoi-do-cong-so.jpg',
                'summary' => 'Hướng dẫn chi tiết cách phối đồ công sở lịch sự nhưng vẫn thời trang và năng động cho các nàng công sở.',
                'content' => '
                    <h2>Set đồ công sở cơ bản</h2>
                    <p>Một bộ vest form chuẩn, áo sơ mi trắng và quần tây là combo không bao giờ lỗi thời cho môi trường công sở.</p>
                    <img src="/storage/news/details/cong-so-co-ban.jpg" alt="Công sở cơ bản" style="width: 100%; margin: 20px 0;">
                    
                    <h2>Phụ kiện điểm nhấn</h2>
                    <p>Một chiếc túi xách cao cấp, giày cao gót thanh lịch hoặc khăn lụa sẽ giúp tổng thể trang phục thêm phần sang trọng và chuyên nghiệp.</p>
                    <img src="/storage/news/details/cong-so-phu-kien.jpg" alt="Phụ kiện công sở" style="width: 100%; margin: 20px 0;">
                    
                    <h2>Tips mix-match</h2>
                    <p>Đừng ngại thử nghiệm với những họa tiết nhẹ nhàng như kẻ sọc, chấm bi để tạo điểm nhấn cho outfit công sở.</p>
                ',
                'status' => 'published',
                'view_count' => 230,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'id' => 3,
                'user_id' => 1,
                'title' => 'Top 10 item thời trang nam must-have 2025',
                'thumbnail' => 'news/top-10-nam.jpg',
                'summary' => 'Điểm danh 10 món đồ thời trang nam không thể thiếu trong tủ đồ của các chàng trai hiện đại.',
                'content' => '
                    <h2>1. Áo Sơ Mi Trắng</h2>
                    <p>Món đồ cơ bản nhất mà mọi quý ông nên có. Dễ phối với mọi trang phục từ casual đến formal.</p>
                    <img src="/storage/news/details/top10-somi.jpg" alt="Áo sơ mi trắng" style="width: 100%; margin: 20px 0;">
                    
                    <h2>2. Quần Jean Đen</h2>
                    <p>Quần jean đen form slim fit là lựa chọn hoàn hảo, dễ phối với áo thun, áo sơ mi hay áo khoác.</p>
                    <img src="/storage/news/details/top10-jean.jpg" alt="Quần jean đen" style="width: 100%; margin: 20px 0;">
                    
                    <h2>3. Áo Khoác Bomber</h2>
                    <p>Item tạo phong cách streetwear năng động, phù hợp cho cả đi chơi lẫn đi làm.</p>
                    
                    <h2>4. Giày Sneaker Trắng</h2>
                    <p>Đôi giày sneaker trắng là must-have item giúp hoàn thiện mọi outfit.</p>
                ',
                'status' => 'published',
                'view_count' => 320,
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'id' => 4,
                'user_id' => 1,
                'title' => 'Bí quyết chọn size quần áo chuẩn không cần chỉnh sửa',
                'thumbnail' => 'news/chon-size.jpg',
                'summary' => 'Hướng dẫn cách đo và chọn size quần áo phù hợp với từng vóc dáng để có được bộ trang phục ưng ý nhất.',
                'content' => '
                    <h2>Cách đo số đo cơ thể</h2>
                    <p>Để chọn được size chuẩn, bạn cần đo chính xác các số đo: vòng ngực, vòng eo, vòng mông, chiều dài tay và chiều cao.</p>
                    
                    <h2>Bảng size chuẩn</h2>
                    <p>Mỗi thương hiệu có bảng size khác nhau. Hãy luôn tham khảo size chart trước khi đặt hàng.</p>
                    
                    <h2>Lưu ý khi chọn size</h2>
                    <ul>
                        <li>Nếu số đo nằm giữa 2 size, nên chọn size lớn hơn</li>
                        <li>Với áo khoác, nên chọn rộng 1 size để thoải mái</li>
                        <li>Quần jean thường co 1-2cm sau vài lần giặt</li>
                    </ul>
                ',
                'status' => 'published',
                'view_count' => 180,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'id' => 5,
                'user_id' => 1,
                'title' => 'Chăm sóc và bảo quản quần áo đúng cách',
                'thumbnail' => 'news/bao-quan-do.jpg',
                'summary' => 'Những mẹo nhỏ giúp bạn chăm sóc và bảo quản quần áo luôn như mới, kéo dài tuổi thọ cho trang phục yêu thích.',
                'content' => '
                    <h2>Phân loại quần áo trước khi giặt</h2>
                    <p>Hãy phân loại theo màu sắc (trắng, màu, đen) và chất liệu để tránh phai màu và hư hỏng.</p>
                    
                    <h2>Nhiệt độ nước phù hợp</h2>
                    <p>Quần áo cotton giặt ở 30-40°C, len và lụa nên giặt nước lạnh, quần áo trắng có thể dùng nước nóng 60°C.</p>
                    
                    <h2>Cách phơi đúng cách</h2>
                    <p>Áo len nên phơi ngang, áo sơ mi treo móc, quần jean lộn ngược để giữ màu.</p>
                    
                    <h2>Bảo quản trong tủ</h2>
                    <p>Sử dụng túi chống ẩm, móc treo phù hợp và sắp xếp gọn gàng để quần áo luôn thơm tho.</p>
                ',
                'status' => 'pending',
                'view_count' => 45,
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'id' => 6,
                'user_id' => 2, // User thường
                'title' => 'Review áo khoác da hot nhất mùa đông này',
                'thumbnail' => 'news/review-ao-da.jpg',
                'summary' => 'Trải nghiệm thực tế về chiếc áo khoác da được nhiều fashionista săn đón trong mùa đông năm nay.',
                'content' => '
                    <h2>Chất liệu</h2>
                    <p>Áo khoác da PU cao cấp, mềm mại, không bóng nhựa như áo da giá rẻ.</p>
                    
                    <h2>Form dáng</h2>
                    <p>Form oversize vừa phải, mặc lên rất cool ngầu và ấm áp.</p>
                    
                    <h2>Giá cả</h2>
                    <p>Với mức giá 890.000đ thì chất lượng và thiết kế rất đáng tiền.</p>
                ',
                'status' => 'draft',
                'view_count' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('news')->insert($newsItems);
    }
}
