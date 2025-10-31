import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    });
};

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [], subtotal = 0 } = location.state || {};

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.address || !form.email) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);

        // Giả lập xử lý đơn hàng (2.5 giây)
        setTimeout(() => {
            setLoading(false);
            alert("Đặt hàng thành công!");
            navigate("/"); // Quay về trang chủ
        }, 2500);
    };

    return (
        <div className="main-content-wrapper2">
            {/* ===== Banner ===== */}
            <div className="page-header-banner">
                <div className="banner-overlay">
                    <h1>Thanh Toán</h1>
                    <p className="breadcrumb">Trang chủ / Thanh Toán</p>
                </div>
            </div>


            {/* ===== Nội dung checkout ===== */}
            <div className="checkout-page-container">
                {/* Cột trái: Form thông tin */}
                <div className="checkout-form-column">
                    <h2>Thông tin người nhận</h2>
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <label htmlFor="name">Họ và tên</label>
                        <input
                            id="name"
                            name="name"
                            placeholder="Nhập họ tên..."
                            value={form.name}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            id="phone"
                            name="phone"
                            placeholder="Nhập số điện thoại..."
                            value={form.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            id="address"
                            name="address"
                            placeholder="Nhập địa chỉ nhận hàng..."
                            value={form.address}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            placeholder="Nhập email..."
                            value={form.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <button type="submit" className="place-order-btn" disabled={loading}>
                            {loading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    <span>Đang xử lý...</span>
                                </div>
                            ) : (
                                "ĐẶT HÀNG"
                            )}
                        </button>
                    </form>
                </div>

                {/* Cột phải: Tóm tắt đơn hàng */}
                <div className="checkout-summary-column">
                    <h3>Đơn hàng của bạn</h3>

                    {cartItems.length === 0 ? (
                        <p>Không có sản phẩm nào trong giỏ.</p>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={item.id} className="checkout-summary-row">
                                    <span>
                                        {item.name} × {item.quantity}
                                    </span>
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}

                            <div className="checkout-summary-row total">
                                <span>Tổng cộng: </span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
