import React from "react";
import { useParams } from "react-router-dom";

import Footer from "../Footer";
import BlogCart from "./BlogCart";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();

  const posts = [
    {
      id: 1,
      title: "Top 5 xu hướng thời trang Thu - Đông 2025",
      image: "/Image/aoKhoacNam.jpg",
      date: "25/10/2025",
      author: "MovaShop",
      content: `
        Mùa thu - đông 2025 mang đến nhiều xu hướng mới lạ như áo khoác oversize, boots cao cổ và chất liệu da mềm.
        Phong cách minimal vẫn là lựa chọn hàng đầu, nhưng được nhấn nhá thêm bằng phụ kiện nổi bật như túi mini và khăn len bản to.
        Hãy thử phối áo khoác dáng dài với quần jean và áo cổ lọ để tạo nên vẻ ngoài thanh lịch mà vẫn ấm áp nhé!`,
    },
    {
      id: 2,
      title: "Cách phối đồ với áo khoác da cực sành điệu",
      image: "/Image/aoKhoacDaNu.jpg",
      date: "20/10/2025",
      author: "Stylist Mova",
      content: `
        Áo khoác da là item không thể thiếu trong tủ đồ của mọi tín đồ thời trang.
        Bạn có thể phối với quần skinny jeans, áo thun trắng và đôi boots để có vẻ ngoài năng động.
        Nếu muốn sang trọng hơn, hãy chọn áo khoác da dáng dài kết hợp cùng váy ôm và giày cao gót.`,
    },
    {
      id: 3,
      title: "Mẹo chọn outfit phù hợp dáng người",
      image: "/Image/quanJeansNu.webp",
      date: "18/10/2025",
      author: "Fashion Editor",
      content: `
        Mỗi dáng người đều có điểm mạnh riêng, vì vậy hãy chọn trang phục làm nổi bật ưu điểm đó.
        Nếu bạn có dáng người nhỏ nhắn, hãy ưu tiên quần cạp cao và áo croptop.
        Với người có dáng đầy đặn, nên chọn màu tối và form suông nhẹ để tôn dáng tự nhiên.`,
    },
  ];

  const post = posts.find((p) => p.id === parseInt(id));
  if (!post) return <p>Bài viết không tồn tại</p>;

  const relatedPosts = posts.filter((p) => p.id !== parseInt(id));

  return (
    <div className="blog-detail">
      <div className="blog-detail-container">
        <div className="blog-detail-main">
          <h1>{post.title}</h1>
          <p className="detail-meta">
            🗓 {post.date} — ✍️ {post.author}
          </p>
          <img src={post.image} alt={post.title} className="detail-image" />
          <p className="detail-content">{post.content}</p>
        </div>

        <aside className="blog-detail-sidebar">
          <h3>Bài viết liên quan</h3>
          {relatedPosts.map((item) => (
            <BlogCart key={item.id} post={item} />
          ))}
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
