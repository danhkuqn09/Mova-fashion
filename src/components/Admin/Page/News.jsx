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

    const [selectedNews, setSelectedNews] = useState(null);

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
            console.log(res.data.data.news);
            
        } catch (error) {
            console.error("Lỗi khi tải news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [page]);

    // Mở popup
    const openPopup = (item) => {
        setSelectedNews(item);
    };

    const closePopup = () => {
        setSelectedNews(null);
    };

    // APPROVE
    const handleApprove = async () => {
        try {
            await axios.post(
                `http://localhost:8000/api/admin/news/${selectedNews.id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            closePopup();
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Không thể duyệt bài viết");
        }
    };

    // REJECT — backend không nhận reason → không gửi
    const handleReject = async () => {
        try {
            await axios.post(
                `http://localhost:8000/api/admin/news/${selectedNews.id}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            closePopup();
            fetchNews();
        } catch (err) {
            console.error(err);
            alert("Không thể từ chối bài viết");
        }
    };

    // DELETE — backend không nhận reason → không gửi
    const handleDelete = async () => {
        try {
            await axios.delete(
                `http://localhost:8000/api/admin/news/${selectedNews.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            closePopup();
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

                    {/* Bộ lọc */}
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

                        <button className="btn-search" onClick={fetchNews}>
                            Tìm kiếm
                        </button>
                    </div>

                    {/* DANH SÁCH */}
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
                                                    className="thumb"
                                                />
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td>{n.title}</td>
                                        <td>{n.author.name}</td>
                                        <td>{n.status_text}</td>
                                        <td>{n.view_count}</td>
                                        <td>{n.created_at}</td>
                                        <td>
                                            <button
                                                onClick={() => openPopup(n)}
                                                className="btn-view"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* PHÂN TRANG */}
                    <div className="pagination">
                        {Array.from(
                            { length: pagination.last_page || 1 },
                            (_, i) => (
                                <button
                                    key={i}
                                    className={page === i + 1 ? "active" : ""}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* POPUP */}
            {selectedNews && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Chi tiết bài viết #{selectedNews.id}</h2>

                        {selectedNews.thumbnail && (
                            <img
                                src={`http://localhost:8000${selectedNews.thumbnail}`}
                                className="popup-thumb"
                            />
                        )}

                        <p><b>Tiêu đề: </b> {selectedNews.title}</p>
                        <p><b>Tác giả: </b> {selectedNews.author.name}</p>
                        <p><b>Tóm tắt: </b> {selectedNews.summary}</p>
                        <p><b>Nội dung: </b>{selectedNews.content}</p>
                        <p><b>Trạng thái: </b> {selectedNews.status_text}</p>
                        <p><b>Ngày tạo: </b> {selectedNews.created_at}</p>

                        {/* Không còn ô nhập lý do */}

                        <div className="popup-actions">
                            <button className="btn-approve" onClick={handleApprove}>
                                Duyệt
                            </button>

                            <button className="btn-reject" onClick={handleReject}>
                                Từ chối
                            </button>

                            <button className="btn-delete" onClick={handleDelete}>
                                Xóa
                            </button>

                            <button className="btn-close" onClick={closePopup}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default News;
