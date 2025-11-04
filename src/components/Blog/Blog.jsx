import React from "react";
import "./Blog.css";

import Footer from "../Footer";
import { Link } from "react-router-dom";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Top 5 xu hướng thời trang Thu - Đông 2025",
      image:
        "/Image/aoKhoacNam.jpg",
      date: "25/10/2025",
      author: "MovaShop",
      summary:
        "Cập nhật những xu hướng hot nhất Thu - Đông 2025 để giúp bạn luôn dẫn đầu phong cách thời trang.",
    },
    {
      id: 2,
      title: "Cách phối đồ với áo khoác da cực sành điệu",
      image:
        "/Image/aoKhoacDaNu.jpg",
      date: "20/10/2025",
      author: "Stylist Mova",
      summary:
        "Áo khoác da không bao giờ lỗi mốt — cùng học cách mix đồ vừa cá tính vừa sang chảnh nhé!",
    },
    {
      id: 3,
      title: "Mẹo chọn outfit phù hợp dáng người",
      image:
        "/Image/quanJeansNu.webp",
      date: "18/10/2025",
      author: "Fashion Editor",
      summary:
        "Không phải cứ đồ đắt tiền là đẹp — bí quyết là chọn outfit tôn dáng và phù hợp với bạn nhất.",
    },
  ];

  return (
    <div className="blog-page">
      <div className="blog-container">
        <h1 className="blog-title">Tin tức & Mẹo Thời Trang</h1>
        <div className="blog-list">
          {posts.map((post) => (
            <div className="blog-card" key={post.id}>
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-content">
                <h3>{post.title}</h3>
                <p className="blog-meta">
                  🗓 {post.date} — ✍️ {post.author}
                </p>
                <p className="blog-summary">{post.summary}</p>
                <Link to={`/blog/${post.id}`} className="blog-button">
                  Xem thêm
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
