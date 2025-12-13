import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./Css/CommentDetail.css";

const CommentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8000/api/admin/comments/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setComment(res.data.data);
        } catch (err) {
            console.error("Lỗi load chi tiết:", err);
            alert("Không thể tải chi tiết bình luận");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!comment) return <p>Không có dữ liệu</p>;

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />

                <div className="admin-page comment-detail">
                    <button onClick={() => navigate(-1)} className="btn-back">
                        ← Quay lại
                    </button>
                    <h1>Chi tiết bình luận</h1>

                    <section className="box">
                        <h3>Nội dung</h3>
                        <p>{comment.content}</p>

                        {comment.image && (
                            <img
                                src={comment.image}
                                alt="comment"
                                className="detail-image"
                            />
                        )}
                    </section>

                    <section className="box">
                        <h3>Người dùng</h3>
                        <p><b>Tên:</b> {comment.user.name}</p>
                        <p><b>Email:</b> {comment.user.email}</p>
                        <p><b>Tổng bình luận:</b> {comment.user.total_comments}</p>
                    </section>

                    <section className="box">
                        <h3>Sản phẩm</h3>
                        <p><b>Tên:</b> {comment.product.name}</p>
                        <p>
                            <b>Danh mục:</b>{" "}
                            {comment.product.category?.name || "Không"}
                        </p>
                        <p>
                            <b>Số bình luận:</b>{" "}
                            {comment.product.total_comments}
                        </p>
                    </section>

                    <section className="box">
                        <p><b>Ngày tạo:</b> {comment.created_at}</p>
                        <p><b>Cập nhật:</b> {comment.updated_at}</p>
                    </section>


                </div>
            </div>
        </div>
    );
};

export default CommentDetail;
