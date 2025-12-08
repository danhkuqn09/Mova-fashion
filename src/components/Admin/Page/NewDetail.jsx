import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/News.css";

const NewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/admin/news/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            setNews(res.data.data);
        } catch (err) {
            console.error("Lỗi khi tải chi tiết:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, []);

    const handleApprove = async () => {
        await axios.post(
            `http://localhost:8000/api/admin/news/${id}/approve`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        navigate("/admin/news");
    };

    const handleReject = async () => {
        await axios.post(
            `http://localhost:8000/api/admin/news/${id}/reject`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        navigate("/admin/news");
    };

    const handleDelete = async () => {
        await axios.delete(
            `http://localhost:8000/api/admin/news/${id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        navigate("/admin/news");
    };

    if (loading) return <p>Đang tải...</p>;
    if (!news) return <p>Không tìm thấy bài viết</p>;

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page">
                    <h1>Chi tiết bài viết #{news.id}</h1>

                    {news.thumbnail && (
                        <img
                            src={`http://localhost:8000${news.thumbnail}`}
                            className="detail-thumb"
                        />
                    )}

                    <p><b>Tiêu đề:</b> {news.title}</p>
                    <p><b>Tác giả:</b> {news.author.name}</p>
                    <p><b>Tóm tắt:</b> {news.summary}</p>
                    <p><b>Nội dung:</b></p>
                    <div className="news-content">{news.content}</div>

                    <p><b>Trạng thái:</b> {news.status_text}</p>
                    <p><b>Ngày tạo:</b> {news.created_at}</p>

                    <div className="popup-actions">
                        <button className="btn-approve" onClick={handleApprove}>Duyệt</button>
                        <button className="btn-reject" onClick={handleReject}>Từ chối</button>
                        <button className="btn-delete" onClick={handleDelete}>Xóa</button>
                        <button className="btn-close" onClick={() => navigate(-1)}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewDetail;
