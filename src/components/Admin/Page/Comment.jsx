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
                    <h1>Quản lý Bình Luận</h1>

                    {/* SEARCH */}
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bình luận / user / sản phẩm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* TABLE */}
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
                                                <img
                                                    src={c.image}
                                                    alt="comment"
                                                    className="comment-image"
                                                />
                                            ) : (
                                                "Không có"
                                            )}
                                        </td>
                                        <td>{c.created_at}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    navigate(`/admin/comments/${c.id}`)
                                                }
                                            >
                                                Xem
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(c)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    {pagination.total > 0 && (
                        <div className="pagination">
                            {[...Array(pagination.last_page)].map((_, i) => (
                                <button
                                    key={i}
                                    className={
                                        pagination.current_page === i + 1
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() => fetchComments(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comments;
