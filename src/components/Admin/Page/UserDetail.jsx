import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./UserDetail.css";

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDetail(res.data.data);
        } catch (err) {
            console.error(err);
            alert("Không thể load thông tin user!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, []);

    if (loading) return <div>Đang tải...</div>;
    if (!detail) return <div>Không có dữ liệu!</div>;

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page user-detail-page">
                    
                    <button className="back-btn" onClick={() => navigate(-1)}>⬅ Quay lại</button>

                    <h1>Chi tiết User</h1>

                    <div className="detail-box">
                        <p><b>ID:</b> {detail.user.id}</p>
                        <p><b>Tên:</b> {detail.user.name}</p>
                        <p><b>Email:</b> {detail.user.email}</p>
                        <p><b>SĐT:</b> {detail.user.phone}</p>
                        <p><b>Role:</b> {detail.user.role}</p>
                        <p><b>Xác thực email:</b> {detail.user.email_verified_at || "Chưa"}</p>
                        <hr />

                        <h2>Thống kê</h2>
                        <p><b>Tổng đơn:</b> {detail.statistics.total_orders}</p>
                        <p><b>Chi tiêu:</b> {detail.statistics.total_spent.toLocaleString()}₫</p>

                        <h2>5 đơn gần nhất</h2>
                        {detail.recent_orders.length > 0 ? (
                            detail.recent_orders.map((o) => (
                                <div className="order-item" key={o.id}>
                                    <p><b>Mã đơn:</b> {o.order_code}</p>
                                    <p><b>Tổng:</b> {o.final_total.toLocaleString()}₫</p>
                                </div>
                            ))
                        ) : (
                            <p>Không có đơn nào</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
