import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/NewDetail.css";

const NewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8000/api/admin/news/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            setNews(res.data.data);
        } catch (err) {
            console.error("Lỗi load chi tiết bài viết:", err);
            console.error("Error response:", err.response?.data);
            
            const errorMsg = err.response?.data?.message || "Không thể tải chi tiết bài viết";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm("Bạn có chắc muốn duyệt bài viết này?")) return;

        try {
            const res = await axios.post(
                `http://localhost:8000/api/admin/news/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data.success) {
                alert("Duyệt bài viết thành công!");
                fetchDetail();
            }
        } catch (err) {
            console.error("Lỗi khi duyệt bài viết:", err);
            alert(err.response?.data?.message || "Không thể duyệt bài viết");
        }
    };

    const handleReject = async () => {
        const reason = prompt("Nhập lý do từ chối:");
        if (!reason) return;

        try {
            const res = await axios.post(
                `http://localhost:8000/api/admin/news/${id}/reject`,
                { reason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (res.data.success) {
                alert("Từ chối bài viết thành công!");
                fetchDetail();
            }
        } catch (err) {
            console.error("Lỗi khi từ chối bài viết:", err);
            alert(err.response?.data?.message || "Không thể từ chối bài viết");
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                <Sidebar />
                <div className="admin-main">
                    <Topbar />
                    <div className="admin-page">
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="admin-container">
                <Sidebar />
                <div className="admin-main">
                    <Topbar />
                    <div className="admin-page">
                        <div className="alert alert-warning">Không có dữ liệu</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">Chi tiết bài viết</h1>
                        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                            <i className="fas fa-arrow-left me-2"></i>Quay lại
                        </button>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h2 className="mb-3">{news.title}</h2>
                                    <div className="d-flex gap-3 text-muted">
                                        <span>
                                            <i className="fas fa-user me-1"></i>
                                            <strong>Tác giả:</strong> {news.author?.name}
                                        </span>
                                        <span>
                                            <i className="fas fa-eye me-1"></i>
                                            <strong>Lượt xem:</strong> {news.view_count}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    {news.status === 'pending' && (
                                        <span className="badge bg-warning text-dark fs-6">Chờ duyệt</span>
                                    )}
                                    {news.status === 'published' && (
                                        <span className="badge bg-success fs-6">Đã duyệt</span>
                                    )}
                                    {news.status === 'rejected' && (
                                        <span className="badge bg-danger fs-6">Bị từ chối</span>
                                    )}
                                </div>
                            </div>

                            {news.thumbnail && (
                                <div className="text-center mb-4">
                                    <img
                                        src={`http://localhost:8000${news.thumbnail}`}
                                        alt={news.title}
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            <div 
                                className="news-content mb-4"
                                style={{ fontSize: '1.05rem', lineHeight: '1.8' }}
                                dangerouslySetInnerHTML={{ __html: news.content }}
                            />

                            <hr />

                            <div className="row text-muted small">
                                <div className="col-md-6">
                                    <i className="fas fa-calendar-plus me-2"></i>
                                    <strong>Ngày tạo:</strong> {news.created_at}
                                </div>
                                <div className="col-md-6">
                                    <i className="fas fa-calendar-check me-2"></i>
                                    <strong>Cập nhật:</strong> {news.updated_at}
                                </div>
                            </div>
                        </div>
                    </div>

                    {news.status === 'pending' && (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="mb-3">
                                    <i className="fas fa-tasks me-2" style={{ color: '#b88e2f' }}></i>
                                    Hành động Admin
                                </h5>
                                <div className="d-flex gap-2">
                                    <button 
                                        onClick={handleApprove}
                                        className="btn btn-success"
                                    >
                                        <i className="fas fa-check me-2"></i>
                                        Duyệt bài viết
                                    </button>
                                    <button 
                                        onClick={handleReject}
                                        className="btn btn-danger"
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {news.status === 'rejected' && news.reject_reason && (
                        <div className="alert alert-danger mt-3">
                            <strong>Lý do từ chối:</strong> {news.reject_reason}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewDetail;
