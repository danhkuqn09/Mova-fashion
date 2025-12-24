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
    <div className="news-page">
      {selectedNews ? (
        <div className="news-detail-container">
          {/* Chi tiết bài viết */}
          <div className="news-detail-main">
            <button className="back-btn" onClick={() => setSelectedNews(null)}>
              <i className="fas fa-arrow-left"></i> Quay lại
            </button>
            
            <h1 className="news-detail-title">{selectedNews.title}</h1>
            
            <div className="news-meta">
              <span className="meta-item">
                <i className="far fa-user"></i> {selectedNews.author?.name || 'Admin'}
              </span>
              <span className="meta-item">
                <i className="far fa-calendar"></i> {selectedNews.created_at}
              </span>
              <span className="meta-item">
                <i className="far fa-eye"></i> {selectedNews.view_count || 0} lượt xem
              </span>
            </div>

            {selectedNews.thumbnail && (
              <img 
                src={`http://localhost:8000${selectedNews.thumbnail}`} 
                alt={selectedNews.title}
                className="news-detail-image"
              />
            )}

            <div className="news-detail-content">
              <p className="summary">{selectedNews.summary}</p>
              <div className="content" dangerouslySetInnerHTML={{ __html: selectedNews.content }}></div>
            </div>
          </div>

          {/* Sidebar - Bài viết khác */}
          <aside className="news-sidebar">
            <h3 className="sidebar-title">Bài viết khác</h3>
            <div className="related-news-list">
              {allNews
                .filter((n) => n.id !== selectedNews.id)
                .slice(0, 5)
                .map((n) => (
                  <div
                    key={n.id}
                    className="related-news-item"
                    onClick={() => fetchNewsDetail(n.id)}
                  >
                    {n.thumbnail && (
                      <img src={`http://localhost:8000${n.thumbnail}`} alt={n.title} />
                    )}
                    <div className="related-info">
                      <h4>{n.title}</h4>
                      <p className="related-date">
                        <i className="far fa-calendar"></i> {n.created_at}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </aside>
        </div>
      ) : (
        /* Danh sách tất cả bài viết */
        <div className="news-list-container">
          <div className="news-header">
            <h1 className="page-title">
              <i className="fas fa-newspaper"></i> Tất cả bài viết
            </h1>
            <p className="page-subtitle">Khám phá những tin tức và xu hướng mới nhất</p>
          </div>

          <div className="news-grid">
            {allNews.length === 0 ? (
              <div className="no-news">
                <i className="fas fa-inbox fa-3x"></i>
                <p>Chưa có bài viết nào</p>
              </div>
            ) : (
              allNews.map((n) => (
                <div key={n.id} className="news-card" onClick={() => fetchNewsDetail(n.id)}>
                  <div className="news-card-image">
                    {n.thumbnail ? (
                      <img src={`http://localhost:8000${n.thumbnail}`} alt={n.title} />
                    ) : (
                      <div className="no-image">
                        <i className="far fa-image"></i>
                      </div>
                    )}
                  </div>
                  
                  <div className="news-card-content">
                    <h3 className="news-card-title">{n.title}</h3>
                    <p className="news-card-summary">{n.summary}</p>
                    
                    <div className="news-card-footer">
                      <span className="author">
                        <i className="far fa-user"></i> {n.author?.name || 'Admin'}
                      </span>
                      <span className="date">
                        <i className="far fa-calendar"></i> {n.created_at}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPage;
