import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/NewDetail.css";

const NewsDetail = () => {
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
            alert("Không thể tải chi tiết bài viết");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!news) return <p>Không có dữ liệu</p>;

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page news-detail">
                    <h1>Chi tiết bài viết</h1>

                    <div className="box">
                        <h2>{news.title}</h2>

                        {news.thumbnail && (
                            <img
                                src={`http://localhost:8000${news.thumbnail}`}
                                alt={news.title}
                                className="news-thumb"
                            />
                        )}

                        <p className="meta">
                            <b>Tác giả:</b> {news.author?.name} |{" "}
                            <b>Trạng thái:</b> {news.status_text}
                        </p>

                        <p>
                            <b>Lượt xem:</b> {news.view_count}
                        </p>

                        <div
                            className="news-content"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        <p>
                            <b>Ngày tạo:</b> {news.created_at}
                        </p>
                        <p>
                            <b>Cập nhật:</b> {news.updated_at}
                        </p>
                    </div>

                    <button onClick={() => navigate(-1)} className="btn-back">
                        ← Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
