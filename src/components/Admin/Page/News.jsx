import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/News.css";

const News = () => {
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);


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
    }, [page]);

    // APPROVE NEWS
    const handleApprove = async (id) => {
        if (!window.confirm("Xác nhận duyệt bài viết?")) return;

        try {
            await axios.post(`http://localhost:8000/api/admin/news/${id}/approve`);
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Không thể duyệt bài viết");
        }
    };

    // REJECT NEWS
    const handleReject = async (id) => {
        if (!window.confirm("Xác nhận từ chối bài viết?")) return;

        try {
            await axios.post(`http://localhost:8000/api/admin/news/${id}/reject`);
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Không thể từ chối bài viết");
        }
    };

    // DELETE NEWS
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa bài viết?")) return;

        try {
            await axios.delete(`http://localhost:8000/api/admin/news/${id}`);
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Không thể xóa bài viết");
        }
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <h1>Quản lý Bài Viết</h1>
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tiêu đề hoặc tác giả..."
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                        />
                        <select
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
                        <button
                            className="btn-search"
                            onClick={() => {
                                setPage(1);
                                fetchNews();
                            }}
                        >
                            Tìm kiếm
                        </button>

                    </div>


                    {/* DANH SÁCH NEWS */}
                    {loading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <table className="news-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Thumbnail</th>
                                    <th>Tiêu đề</th>
                                    <th>Tác giả</th>
                                    <th>Trạng thái</th>
                                    <th>Lượt xem</th>
                                    <th>Ngày tạo</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {news.map((n) => (
                                    <tr key={n.id}>
                                        <td>{n.id}</td>
                                        <td>
                                            {n.thumbnail ? (
                                                <img
                                                    src={`http://localhost:8000${n.thumbnail}`}
                                                    alt=""
                                                    className="thumb"
                                                />
                                            ) : "—"}
                                        </td>
                                        <td>{n.title}</td>
                                        <td>{n.author.name}</td>
                                        <td>{n.status_text}</td>
                                        <td>{n.view_count}</td>
                                        <td>{n.created_at}</td>
                                        <td>
                                            {n.status === "pending" && (
                                                <>
                                                    <button onClick={() => handleApprove(n.id)} className="btn-approve">Duyệt</button>
                                                    <button onClick={() => handleReject(n.id)} className="btn-reject">Từ chối</button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(n.id)}
                                                className="btn-delete"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* PHÂN TRANG */}
                    <div className="pagination">
                        {Array.from({ length: pagination.last_page || 1 }, (_, i) => (
                            <button
                                key={i}
                                className={page === i + 1 ? "active" : ""}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
