import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/Comment.css";

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Chi tiết comment
    const [detailComment, setDetailComment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const token = localStorage.getItem("token");

    // Lấy danh sách bình luận
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

    // Xem chi tiết
    const viewDetail = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/admin/comments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDetailComment(res.data.data);
            setShowDetailModal(true);
        } catch (err) {
            console.error("Lỗi khi xem chi tiết bình luận:", err);
            alert("Không thể xem chi tiết bình luận");
        }
    };

    // Xóa comment
    const handleDelete = async (comment) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa bình luận của ${comment.user.name}?`
        );
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:8000/api/admin/comments/${comment.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Xóa bình luận thành công!");
            fetchComments(); // tải lại danh sách
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
                    <h1>Quản lý Bình Luận</h1>

                    {/* Tìm kiếm */}
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bình luận / user / sản phẩm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Bảng bình luận */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người dùng</th>
                                <th>Sản phẩm</th>
                                <th>Nội dung</th>
                                <th>Ảnh</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7">Đang tải...</td>
                                </tr>
                            ) : comments.length === 0 ? (
                                <tr>
                                    <td colSpan="7">Không có dữ liệu</td>
                                </tr>
                            ) : (
                                comments.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.user.name}</td>
                                        <td>{c.product.name}</td>
                                        <td>{c.content}</td>
                                        <td>
                                            {c.image ? (
                                                <img src={c.image} alt="comment" className="comment-image" />
                                            ) : "Không có"}
                                        </td>
                                        <td>{c.created_at}</td>
                                        <td>
                                            <button onClick={() => viewDetail(c.id)} className="btn-edit">
                                                Xem
                                            </button>
                                            <button onClick={() => handleDelete(c)} className="btn-delete">
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination.total > 0 && (
                        <div className="pagination">
                            {[...Array(pagination.last_page)].map((_, i) => (
                                <button
                                    key={i}
                                    className={pagination.current_page === i + 1 ? "active" : ""}
                                    onClick={() => fetchComments(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Detail Modal */}
                    {showDetailModal && detailComment && (
                        <div className="modal-comment">
                            <div className="modal-content">
                                <h2>Chi tiết bình luận</h2>
                                <p>
                                    <b>Nội dung:</b> {detailComment.content}
                                </p>
                                {detailComment.image && (
                                    <img src={detailComment.image} alt="comment" style={{ maxWidth: "100%" }} />
                                )}
                                <h3>Người dùng</h3>
                                <p>{detailComment.user.name}</p>
                                <p>{detailComment.user.email}</p>
                                <p>Tổng số bình luận đã viết: {detailComment.user.total_comments}</p>

                                <h3>Sản phẩm</h3>
                                <p>{detailComment.product.name}</p>
                                <p>Category: {detailComment.product.category?.name || "Không"}</p>
                                <p>Số bình luận: {detailComment.product.total_comments}</p>

                                <p>Ngày tạo: {detailComment.created_at}</p>
                                <p>Ngày cập nhật: {detailComment.updated_at}</p>

                                <button onClick={() => setShowDetailModal(false)}>Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comments;
