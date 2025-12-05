import React, { useEffect, useState } from "react";
import axios from "axios";
import "./New.css"; // import CSS

const NewPage = () => {
  const [allNews, setAllNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const token = localStorage.getItem("token");
  console.log(token);
  

  const fetchAllNews = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/news", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      setAllNews(Array.isArray(res.data.data.news) ? res.data.data.news : []);
    } catch (error) {
      console.error("Fetch all news error:", error);
      setAllNews([]);
    }
  };

  const fetchNewsDetail = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/news/${id}`);
      setSelectedNews(res.data.data);
    } catch (error) {
      console.error("Fetch news detail error:", error);
      setSelectedNews(null);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  return (
    <div className="news-container">
  {/* Danh sách bài viết khác */}
  {selectedNews && (
    <div className="news-list">
      <h2 className="related-title">Bài viết khác</h2>
      {allNews
        .filter((n) => n.id !== selectedNews.id) // loại bỏ bài đang xem
        .map((n) => (
          <div
            key={n.id}
            className="news-item"
            onClick={() => fetchNewsDetail(n.id)}
          >
            {n.thumbnail && <img src={`http://localhost:8000${n.thumbnail}`} alt="" />}
            <h3>{n.title}</h3>
            <p>{n.summary}</p>
            <p><b>Trạng thái:</b> {n.status_text || "published"}</p>
          </div>
        ))}
    </div>
  )}

  {/* Chi tiết bài viết */}
  {selectedNews && (
    <div className="news-detail">
      <h2>{selectedNews.title}</h2>
      {selectedNews.thumbnail && <img src={`http://localhost:8000${selectedNews.thumbnail}`} alt="" />}
      <h3><p>{selectedNews.content}</p></h3>
      <p><b>Tác giả:</b> {selectedNews.author.name}</p>
      <p><b>Ngày tạo:</b> {selectedNews.created_at}</p>
      <button onClick={() => setSelectedNews(null)}>Đóng</button>
    </div>
  )}

  {/* Nếu chưa chọn bài viết, hiện tất cả bài viết */}
  {!selectedNews && (
    <div className="news-list">
      <h2>Tất cả bài viết</h2>
      {allNews.map((n) => (
        <div key={n.id} className="news-item" onClick={() => fetchNewsDetail(n.id)}>
          {n.thumbnail && <img src={`http://localhost:8000${n.thumbnail}`} alt="" />}
          <h3>{n.title}</h3>
          <p>{n.summary}</p>
          <p><b>Trạng thái:</b> {n.status_text || "published"}</p>
        </div>
      ))}
    </div>
  )}
</div>


  );
};

export default NewPage;
