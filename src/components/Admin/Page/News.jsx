import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/News.css";
import { useNavigate } from "react-router-dom";

const News = () => {
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8000/api/admin/news", {
                params: {
                    search: search || undefined,
                    status: status || undefined,
                    page: page,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json"
                },
            });

            setNews(res.data.data.news);
            setPagination(res.data.data.pagination);

        } catch (error) {
            console.error("Lỗi khi tải news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [page]); // chỉ load khi đổi trang

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">
                            <i className="fas fa-newspaper text-primary me-2"></i>
                            Quản lý bài viết
                        </h1>
                    </div>

                    {/* Bộ lọc */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-5">
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="fas fa-search text-muted"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-0"
                                            placeholder="Tìm kiếm tiêu đề hoặc tác giả..."
                                            value={search}
                                            onChange={(e) => {
                                                setPage(1);
                                                setSearch(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={status}
                                        onChange={(e) => {
                                            setPage(1);
                                            setStatus(e.target.value);
                                        }}
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="pending">Chờ duyệt</option>
                                        <option value="published">Đã duyệt</option>
                                        <option value="rejected">Bị từ chối</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-primary w-100" onClick={fetchNews}>
                                        <i className="fas fa-search me-2"></i>Tìm kiếm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DANH SÁCH */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <>
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: '60px' }}>ID</th>
                                                    <th style={{ width: '100px' }}>Thumbnail</th>
                                                    <th>Tiêu đề</th>
                                                    <th style={{ width: '150px' }}>Tác giả</th>
                                                    <th style={{ width: '150px' }}>Trạng thái</th>
                                                    <th style={{ width: '100px' }}>Lượt xem</th>
                                                    <th style={{ width: '180px' }}>Ngày tạo</th>
                                                    <th style={{ width: '150px' }}>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {news.length > 0 ? (
                                                    news.map((n) => (
                                                        <tr key={n.id}>
                                                            <td className="fw-bold text-primary">#{n.id}</td>
                                                            <td>
                                                                {n.thumbnail ? (
                                                                    <img
                                                                        src={`http://localhost:8000${n.thumbnail}`}
                                                                        alt={n.title}
                                                                        className="rounded"
                                                                        style={{
                                                                            width: '70px',
                                                                            height: '70px',
                                                                            objectFit: 'cover',
                                                                            cursor: 'pointer',
                                                                            transition: 'transform 0.3s ease'
                                                                        }}
                                                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                                        onClick={() => window.open(`http://localhost:8000${n.thumbnail}`, '_blank')}
                                                                    />
                                                                ) : (
                                                                    <span className="text-muted small">Không có ảnh</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="fw-semibold" style={{ maxWidth: '300px' }}>
                                                                    {n.title}
                                                                </div>
                                                            </td>
                                                            <td>{n.author?.name || 'N/A'}</td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    n.status_text === 'Đã xuất bản' ? 'bg-success' :
                                                                    n.status_text === 'Chờ duyệt' ? 'bg-warning' : 
                                                                    n.status_text === 'Bị từ chối' ? 'bg-danger' : 'bg-secondary'
                                                                }`}>
                                                                    {n.status_text}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                <i className="fas fa-eye text-muted me-1"></i>
                                                                {n.view_count}
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">
                                                                    <i className="far fa-calendar-alt me-1"></i>
                                                                    {n.created_at}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() => navigate(`/admin/news/${n.id}`)}
                                                                    className="btn btn-sm btn-info"
                                                                    title="Xem chi tiết"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="text-center text-muted py-4">
                                                            <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                                                            Không tìm thấy bài viết nào
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* PHÂN TRANG */}
                            {pagination.last_page > 1 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setPage(page - 1)}
                                                disabled={page === 1}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                        </li>
                                        {Array.from({ length: pagination.last_page || 1 }, (_, i) => (
                                            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${page === pagination.last_page ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setPage(page + 1)}
                                                disabled={page === pagination.last_page}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default News;
