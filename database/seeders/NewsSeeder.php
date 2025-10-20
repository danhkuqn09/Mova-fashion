<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\NewsDetail;
use App\Models\User;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $admins = User::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            $this->command->warn('No admin users found.');
            return;
        }

        $newsData = [
            [
                'title' => 'Xu hướng thời trang mùa hè 2025',
                'summary' => 'Khám phá những xu hướng thời trang hot nhất mùa hè năm nay với các gam màu pastel dịu dàng và chất liệu thoáng mát.',
                'status' => 'published',
                'content' => 'Mùa hè 2025 đánh dấu sự trở lại mạnh mẽ của phong cách tối giản với các gam màu pastel nhẹ nhàng. Các thiết kế tập trung vào sự thoải mái và bền vững...',
            ],
            [
                'title' => 'Bí quyết phối đồ công sở thanh lịch',
                'summary' => 'Hướng dẫn phối đồ công sở chuyên nghiệp nhưng không kém phần thời trang cho phái nữ hiện đại.',
                'status' => 'published',
                'content' => 'Trang phục công sở không nhất thiết phải nhàm chán. Với một vài bí quyết phối đồ thông minh, bạn có thể tạo nên phong cách chuyên nghiệp mà vẫn nổi bật...',
            ],
            [
                'title' => 'Chất liệu vải thân thiện với môi trường',
                'summary' => 'Tìm hiểu về các loại vải thân thiện với môi trường đang được ưa chuộng trong ngành thời trang.',
                'status' => 'published',
                'content' => 'Xu hướng thời trang bền vững ngày càng được quan tâm. Các chất liệu như cotton hữu cơ, vải tái chế từ nhựa đại dương đang trở thành lựa chọn hàng đầu...',
            ],
            [
                'title' => 'Cách bảo quản quần áo đúng cách',
                'summary' => 'Những mẹo nhỏ giúp quần áo của bạn luôn bền đẹp và giữ được màu sắc lâu hơn.',
                'status' => 'published',
                'content' => 'Bảo quản quần áo đúng cách không chỉ giúp chúng bền hơn mà còn tiết kiệm chi phí. Hãy luôn đọc nhãn hướng dẫn giặt, phân loại màu sắc trước khi giặt...',
            ],
            [
                'title' => 'Thời trang streetwear - Phong cách của giới trẻ',
                'summary' => 'Phong cách streetwear đang làm mưa làm gió trong giới trẻ với sự kết hợp độc đáo giữa thoải mái và cá tính.',
                'status' => 'published',
                'content' => 'Streetwear không chỉ là cách ăn mặc mà còn là thái độ sống. Từ hoodie oversize, sneakers đến accessories statement, mọi thứ đều thể hiện cá tính...',
            ],
            [
                'title' => 'Bộ sưu tập thu đông sắp ra mắt',
                'summary' => 'Sneak peek vào bộ sưu tập thu đông mới nhất của Mova Fashion với những thiết kế ấm áp và sang trọng.',
                'status' => 'draft',
                'content' => 'Bộ sưu tập thu đông năm nay của chúng tôi lấy cảm hứng từ thiên nhiên với các tông màu đất ấm áp. Chất liệu len cao cấp kết hợp cùng thiết kế hiện đại...',
            ],
        ];

        foreach ($newsData as $data) {
            $news = News::create([
                'user_id' => $admins->random()->id,
                'title' => $data['title'],
                'summary' => $data['summary'],
                'status' => $data['status'],
                'thumbnail' => 'uploads/news/thumbnail-' . fake()->numberBetween(1, 10) . '.jpg',
                'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
            ]);

            // Tạo news detail
            NewsDetail::create([
                'news_id' => $news->id,
                'content' => $data['content'],
                'image' => 'uploads/news/detail-' . fake()->numberBetween(1, 10) . '.jpg',
            ]);
        }

        $this->command->info('Created ' . News::count() . ' news articles.');
    }
}
