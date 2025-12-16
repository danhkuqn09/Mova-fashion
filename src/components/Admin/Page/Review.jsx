import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import "./Css/Review.css";
import { useNavigate } from "react-router-dom";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const [stats, setStats] = useState({
    total_reviews: 0,
    average_rating: 0,
    rating_distribution: [],
  });

  const token = localStorage.getItem("token");

  // Hiển thị sao
  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={star <= rating ? "fas fa-star" : "far fa-star"}
            style={{ color: star <= rating ? "#ffc107" : "#ddd" }}
          ></i>
        ))}
      </div>
    );
  };

  // Xóa review
  const handleDelete = async (id) => {
    if (!window.confirm("Định xóa đánh giá này?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Xóa thành công!");
      fetchReviews(pagination.current_page);
      fetchStatistics();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa đánh giá");
    }
  };

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

    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê
  const fetchStatistics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/reviews/statistics",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchStatistics();
  }, []);

  const handleSearch = () => fetchReviews();
  const handlePageChange = (page) => fetchReviews(page);

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-page">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">🌟 Quản lý đánh giá</h1>
          </div>

          {/* Thống kê */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #3498db' }}>
                <div className="card-body d-flex align-items-center">
                  <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-comment-dots fa-2x text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">Tổng đánh giá</h6>
                    <h3 className="mb-0 fw-bold">{stats.total_reviews}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #f39c12' }}>
                <div className="card-body d-flex align-items-center">
                  <div className="flex-shrink-0 rounded-circle p-3 me-3" style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)' }}>
                    <i className="fas fa-star fa-2x" style={{ color: '#f39c12' }}></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1">Đánh giá trung bình</h6>
                    <h3 className="mb-0 fw-bold">{stats.average_rating} / 5.0</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="mb-3 fw-bold">Phân bố đánh giá</h6>
                  {stats.rating_distribution.slice(0, 5).reverse().map((r) => (
                    <div key={r.rating} className="mb-2">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <small className="text-muted">
                          {r.rating} <i className="fas fa-star" style={{ color: '#ffc107', fontSize: '10px' }}></i>
                        </small>
                        <small className="text-muted">{r.count} ({r.percentage}%)</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div
                          className="progress-bar"
                          style={{ width: `${r.percentage}%`, backgroundColor: '#ffc107' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label className="form-label small fw-semibold">Tìm kiếm</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm theo sản phẩm / người dùng"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Lọc theo sao</label>
                  <select
                    className="form-select"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                    <option value="2">2 sao</option>
                    <option value="1">1 sao</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-primary w-100" onClick={handleSearch}>
                    <i className="fas fa-search me-2"></i>Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng review */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger m-4">{error}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '60px' }}>ID</th>
                        <th>Người dùng</th>
                        <th>Sản phẩm</th>
                        <th style={{ width: '100px' }}>Mã đơn</th>
                        <th style={{ width: '120px' }}>Đánh giá</th>
                        <th>Nội dung</th>
                        <th>Ảnh</th>
                        <th style={{ width: '150px' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((r) => (
                        <tr key={r.id}>
                          <td className="fw-bold">#{r.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-2">
                                <i className="fas fa-user-circle fa-2x text-secondary"></i>
                              </div>
                              <div>
                                <div className="fw-semibold">{r.user.name}</div>
                                <small className="text-muted">{r.user.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {r.product.image && (
                                <img
                                  src={`http://localhost:8000${r.product.image}`}
                                  alt={r.product.name}
                                  className="rounded me-2"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                              )}
                              <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                {r.product.name}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-primary">#{r.order_id}</span>
                          </td>
                          <td>
                            {renderStars(r.rating)}
                            <small className="text-muted d-block mt-1">{r.rating}/5</small>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {r.content || <span className="text-muted">Không có nội dung</span>}
                            </div>
                          </td>
                          <td>
                            {r.image ? (
                              <img
                                src={`http://localhost:8000${r.image}`}
                                alt="Review"
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => window.open(`http://localhost:8000${r.image}`, '_blank')}
                              />
                            ) : (
                              <span className="text-muted small">Không có</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => navigate(`/admin/reviews/${r.id}`)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(r.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Phân trang */}
          {pagination.last_page > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  {pagination.current_page > 1 && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </li>
                  )}
                  {[...Array(pagination.last_page)].map((_, i) => (
                    <li key={i} className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  {pagination.current_page < pagination.last_page && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Review;
