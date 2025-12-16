import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/Comment.css";
import { useNavigate } from "react-router-dom";

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // ================= FETCH COMMENTS =================
    const fetchComments = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8000/api/admin/comments", {
                params: {
                    per_page: 10,
                    search,
                    page,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setComments(res.data.data.comments);
            setPagination(res.data.data.pagination);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách bình luận:", err);
            alert("Không thể lấy danh sách bình luận");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [search]);

    // ================= DELETE COMMENT =================
    const handleDelete = async (comment) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa bình luận của ${comment.user.name}?`
        );
        if (!confirmed) return;

        try {
            await axios.delete(
                `http://localhost:8000/api/admin/comments/${comment.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Xóa bình luận thành công!");
            fetchComments();
        } catch (err) {
            console.error("Lỗi khi xóa bình luận:", err);
            alert("Xóa bình luận thất bại!");
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">
                            <i className="fas fa-comments text-primary me-2"></i>
                            Quản lý bình luận
                        </h1>
                    </div>

                    {/* SEARCH */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="fas fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Tìm kiếm bình luận / user / sản phẩm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
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
                                                    <th style={{ width: '150px' }}>Người dùng</th>
                                                    <th style={{ width: '200px' }}>Sản phẩm</th>
                                                    <th>Nội dung</th>
                                                    <th style={{ width: '100px' }}>Ảnh</th>
                                                    <th style={{ width: '180px' }}>Ngày tạo</th>
                                                    <th style={{ width: '150px' }}>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {comments.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="text-center text-muted py-4">
                                                            <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                                                            Không có bình luận nào
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    comments.map((c) => (
                                                        <tr key={c.id}>
                                                            <td className="fw-bold text-primary">#{c.id}</td>
                                                            <td className="fw-semibold">{c.user.name}</td>
                                                            <td>
                                                                <small className="text-muted">{c.product.name}</small>
                                                            </td>
                                                            <td>
                                                                <div style={{ maxWidth: '300px' }}>
                                                                    {c.content.length > 100 
                                                                        ? c.content.substring(0, 100) + '...' 
                                                                        : c.content}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {c.image ? (
                                                                    <img
                                                                        src={c.image}
                                                                        alt="comment"
                                                                        className="rounded"
                                                                        style={{
                                                                            width: '60px',
                                                                            height: '60px',
                                                                            objectFit: 'cover',
                                                                            cursor: 'pointer',
                                                                            transition: 'transform 0.3s ease'
                                                                        }}
                                                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                                        onClick={() => window.open(c.image, '_blank')}
                                                                    />
                                                                ) : (
                                                                    <span className="text-muted small">Không có</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">
                                                                    <i className="far fa-calendar-alt me-1"></i>
                                                                    {c.created_at}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-sm btn-info"
                                                                        onClick={() => navigate(`/admin/comments/${c.id}`)}
                                                                        title="Xem chi tiết"
                                                                    >
                                                                        <i className="fas fa-eye"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => handleDelete(c)}
                                                                        title="Xóa"
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* PAGINATION */}
                            {pagination.total > 0 && pagination.last_page > 1 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => fetchComments(pagination.current_page - 1)}
                                                disabled={pagination.current_page === 1}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                        </li>
                                        {[...Array(pagination.last_page)].map((_, i) => (
                                            <li key={i} className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => fetchComments(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => fetchComments(pagination.current_page + 1)}
                                                disabled={pagination.current_page === pagination.last_page}
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

export default Comments;
