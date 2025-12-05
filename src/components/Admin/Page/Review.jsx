import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Review.css";


const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const [stats, setStats] = useState({
    total_reviews: 0,
    average_rating: 0,
    rating_distribution: [],
  });

  const token = localStorage.getItem("token"); // token admin

  // Lấy danh sách review
  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: search || undefined,
          rating: ratingFilter || undefined,
          per_page: 15,
          page: page,
        },
      });
      setReviews(res.data.data.reviews);
      setPagination(res.data.data.pagination);
      console.log(reviews);

    } catch (err) {
      console.log(err);
      setError("Không thể tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê review
  const fetchStatistics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/reviews/statistics",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchStatistics();
  }, []);

  const handleSearch = () => {
    fetchReviews();
  };

  const handlePageChange = (page) => {
    fetchReviews(page);
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-page">
          <h2>Quản lý đánh giá</h2>
          <div className="review-stats">
  <p>Tổng đánh giá: {stats.total_reviews}</p>
  <p>Đánh giá trung bình: {stats.average_rating}</p>

  <table className="rating-table">
    <thead>
      <tr>
        <th>Số sao</th>
        <th>Số lượt đánh giá</th>
        <th>Tỉ lệ</th>
      </tr>
    </thead>
    <tbody>
      {stats.rating_distribution.map((r) => (
        <tr key={r.rating}>
          <td>{r.rating} ⭐</td>
          <td>{r.count}</td>
          <td>{r.percentage}%</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          {/* Tìm kiếm và lọc */}
          <div className="filters">
            <input
              type="text"
              placeholder="Tìm theo sản phẩm / người dùng"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
              <option value="">Tất cả sao</option>
              <option value="1">1 sao</option>
              <option value="2">2 sao</option>
              <option value="3">3 sao</option>
              <option value="4">4 sao</option>
              <option value="5">5 sao</option>
            </select>

            <button onClick={handleSearch}>Tìm kiếm</button>
          </div>


          {/* Bảng review */}
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table className="review-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người dùng</th>
                  <th>Sản phẩm</th>
                  <th>Mã đơn</th>
                  <th>Số sao</th>
                  <th>Nội dung</th>
                  <th>Ảnh</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.user.name} ({r.user.email})</td>
                    <td>
                      {r.product.name} <br />
                      {r.product.image && (
                        <img src={`http://localhost:8000${r.product.image}`} className="product-image" />
                      )}
                    </td>
                    <td>{r.order_id}</td>
                    <td>{r.rating}</td>
                    <td>{r.content}</td>
                    <td>
                      {r.image && <img src={`http://localhost:8000${r.product.image}`} alt="review" className="review-image" />}
                    </td>
                    <td>{r.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Phân trang */}
          <div className="pagination">
            {pagination.current_page > 1 && (
              <button onClick={() => handlePageChange(pagination.current_page - 1)}>Trước</button>
            )}
            <span>
              {pagination.current_page} / {pagination.last_page}
            </span>
            {pagination.current_page < pagination.last_page && (
              <button onClick={() => handlePageChange(pagination.current_page + 1)}>Sau</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
