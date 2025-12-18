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

    const formatVND = (value) => Number(value || 0).toLocaleString("vi-VN") + "₫";

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

    if (!detail) {
        return (
            <div className="admin-container">
                <Sidebar />
                <div className="admin-main">
                    <Topbar />
                    <div className="admin-page">
                        <div className="alert alert-warning">Không có dữ liệu!</div>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: <span className="badge bg-warning text-dark">Chờ xác nhận</span>,
            processing: <span className="badge bg-info">Đang xử lý</span>,
            shipping: <span className="badge bg-primary">Đang giao</span>,
            completed: <span className="badge bg-success">Hoàn thành</span>,
            cancelled: <span className="badge bg-danger">Đã hủy</span>,
        };
        return badges[status] || <span className="badge bg-secondary">{status}</span>;
    };

    const getPaymentStatusBadge = (status) => {
        const badges = {
            unpaid: <span className="badge bg-warning text-dark">Chưa thanh toán</span>,
            paid: <span className="badge bg-success">Đã thanh toán</span>,
            refunded: <span className="badge bg-secondary">Đã hoàn tiền</span>,
        };
        return badges[status] || <span className="badge bg-secondary">{status}</span>;
    };

    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Topbar />
                <div className="admin-page">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="mb-0">Chi tiết người dùng</h1>
                        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                            <i className="fas fa-arrow-left me-2"></i>Quay lại
                        </button>
                    </div>

                    {/* Thông tin cá nhân */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-user text-primary me-2"></i>Thông tin cá nhân
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-md-3 text-center mb-4 mb-md-0">
                                    {detail.user.avatar ? (
                                        <img
                                            src={`http://localhost:8000${detail.user.avatar}`}
                                            alt={detail.user.name}
                                            className="rounded-circle"
                                            style={{ width: "140px", height: "140px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div
                                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                                            style={{ width: "140px", height: "140px" }}
                                        >
                                            <i className="fas fa-user fa-4x text-white"></i>
                                        </div>
                                    )}

                                    <div className="mt-3">
                                        {detail.user.role === 'admin'
                                            ? <span className="badge bg-danger px-3 py-2">Admin</span>
                                            : <span className="badge bg-primary px-3 py-2">User</span>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="info-box">
                                                <label className="text-muted small fw-semibold text-uppercase mb-1">
                                                    <i className="fas fa-hashtag me-1"></i>ID
                                                </label>
                                                <p className="mb-0 fw-bold fs-5">#{detail.user.id}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-box">
                                                <label className="text-muted small fw-semibold text-uppercase mb-1">
                                                    <i className="fas fa-user me-1"></i>Họ tên
                                                </label>
                                                <p className="mb-0 fw-bold fs-5">{detail.user.name}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-box">
                                                <label className="text-muted small fw-semibold text-uppercase mb-1">
                                                    <i className="fas fa-envelope me-1"></i>Email
                                                </label>
                                                <p className="mb-0">{detail.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-box">
                                                <label className="text-muted small fw-semibold text-uppercase mb-1">
                                                    <i className="fas fa-phone me-1"></i>Số điện thoại
                                                </label>
                                                <p className="mb-0">{detail.user.phone || <span className="text-muted">Chưa có</span>}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-box">
                                                <label className="text-muted small fw-semibold text-uppercase mb-1">
                                                    <i className="fas fa-map-marker-alt me-1"></i>Địa chỉ
                                                </label>
                                                <p className="mb-0">{detail.user.address || <span className="text-muted">Chưa có</span>}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-box">
                                                <label className="text-muted small fw-semibold text-uppercase mb-1">
                                                    <i className="fas fa-check-circle me-1"></i>Xác thực email
                                                </label>
                                                <p className="mb-0">
                                                    {detail.user.email_verified_at
                                                        ? <span className="badge bg-success">Đã xác thực</span>
                                                        : <span className="badge bg-warning text-dark">Chưa xác thực</span>
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-box">
                                                <label className="text-muted small fw-semibold text-uppercase mb-1">
                                                    <i className="fas fa-calendar-alt me-1"></i>Ngày đăng ký
                                                </label>
                                                <p className="mb-0">{detail.user.created_at}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thống kê */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #3498db' }}>
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                        <i className="fas fa-shopping-cart fa-2x text-primary"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="text-muted mb-1">Tổng đơn hàng</h6>
                                        <h3 className="mb-0 fw-bold">{detail.statistics.total_orders}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #b88e2f' }}>
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 rounded-circle p-3 me-3" style={{ backgroundColor: 'rgba(184, 142, 47, 0.1)' }}>
                                        <i className="fas fa-dollar-sign fa-2x" style={{ color: '#b88e2f' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="text-muted mb-1">Tổng chi tiêu</h6>
                                        <h3 className="mb-0 fw-bold" style={{ fontSize: '1.4rem' }}>
                                            {formatVND(detail.statistics.total_spent)}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Đơn gần nhất */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-history text-info me-2"></i>Những đơn hàng gần nhất
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            {detail.recent_orders.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Mã đơn</th>
                                                <th>Ngày đặt</th>
                                                <th>Tổng tiền</th>
                                                <th>Thanh toán</th>
                                                <th>Trạng thái</th>
                                                <th>Phương thức</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detail.recent_orders.map((order) => {
                                                console.log("ORDER DATA:", order);
                                                console.log("payment_method:", order.payment_method);
                                                console.log("payment_status:", order.payment_status);


                                                return (
                                                    <tr key={order.id}>
                                                        <td>
                                                            <span className="badge bg-primary">
                                                                #{order.order_code || `ID-${order.id}`}
                                                            </span>
                                                        </td>
                                                        <td className="text-muted small">
                                                            {order.created_at}
                                                        </td>
                                                        <td className="fw-semibold">
                                                            {formatVND(order.final_total)}
                                                        </td>
                                                        <td>
                                                            {getPaymentStatusBadge(order.payment_status)}
                                                        </td>
                                                        <td>
                                                            {getStatusBadge(order.status)}
                                                        </td>
                                                        <td>
                                                            {order.payment_method === 'COD' && (
                                                                <span className="badge bg-secondary">COD</span>
                                                            )}
                                                            {order.payment_method === 'momo' && (
                                                                <span className="badge" style={{ backgroundColor: '#a50064' }}>Momo</span>
                                                            )}
                                                            {!order.payment_method && (
                                                                <span className="badge bg-light text-dark">N/A</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                    </table>
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                                    Chưa có đơn hàng nào
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
