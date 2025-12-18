import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import axios from "axios";
import "./css/OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");

  const formatVND = (value) => Number(value || 0).toLocaleString("vi-VN") + "₫";

  const statusTexts = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    shipping: "Đang giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const paymentMethodTexts = {
    cod: "COD (Tiền mặt)",
    momo: "Momo",
  };

  const paymentStatusTexts = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    refunded: "Đã hoàn tiền",
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      processing: "#17a2b8",
      shipping: "#007bff",
      completed: "#28a745",
      cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      unpaid: "#ffc107",
      paid: "#28a745",
      refunded: "#6c757d",
    };
    return colors[status] || "#6c757d";
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder(res.data.data);
      setStatus(res.data.data.status);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng", err);
      alert("Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Cập nhật trạng thái thành công!");
      fetchOrder();
    } catch (err) {
      console.error("Lỗi cập nhật", err);
      console.error("Response data:", err.response?.data);
      
      const errorMsg = err.response?.data?.message || "Lỗi cập nhật trạng thái";
      alert(errorMsg);
    }
  };

  const deleteOrder = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Xóa thành công");
      navigate("/admin/orders");
    } catch (err) {
      console.error("Lỗi xóa đơn", err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-page">

          <button className="back-btn" onClick={() => navigate("/admin/orders")}>⬅ Quay lại</button>

          <h1>Chi tiết đơn hàng #{order.id}</h1>

          <div className="order-detail-container">
            {/* Thông tin đơn hàng */}
            <div className="order-info-section">
              <div className="section-header">
                <h3>📋 Thông tin đơn hàng</h3>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value">#{order.id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Ngày đặt:</span>
                  <span className="value">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                </div>
                <div className="info-item">
                  <span className="label">Trạng thái đơn hàng:</span>
                  <span className="value">
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {statusTexts[order.status]}
                    </span>
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Phương thức thanh toán:</span>
                  <span className="value">{paymentMethodTexts[order.payment_method] || order.payment_method}</span>
                </div>
                <div className="info-item">
                  <span className="label">Trạng thái thanh toán:</span>
                  <span className="value">
                    <span className="status-badge" style={{ backgroundColor: getPaymentStatusColor(order.payment_status) }}>
                      {paymentStatusTexts[order.payment_status]}
                    </span>
                  </span>
                </div>
                {order.transaction_id && (
                  <div className="info-item">
                    <span className="label">Mã giao dịch:</span>
                    <span className="value">{order.transaction_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className="order-info-section">
              <div className="section-header">
                <h3>👤 Thông tin khách hàng</h3>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Họ tên:</span>
                  <span className="value">{order.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{order.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{order.phone}</span>
                </div>
                <div className="info-item full-width">
                  <span className="label">Địa chỉ giao hàng:</span>
                  <span className="value">{order.address}</span>
                </div>
                {order.note && (
                  <div className="info-item full-width">
                    <span className="label">Ghi chú:</span>
                    <span className="value">{order.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="order-info-section">
              <div className="section-header">
                <h3>📦 Danh sách sản phẩm</h3>
              </div>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Sản phẩm</th>
                      <th>Màu sắc</th>
                      <th>Kích thước</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img 
                            src={item.product_variant?.color?.image 
                              ? `http://localhost:8000/storage/${item.product_variant.color.image}` 
                              : (item.product_variant?.product?.image 
                                ? `http://localhost:8000/storage/${item.product_variant.product.image}`
                                : '/placeholder.png')
                            } 
                            alt={item.product_variant?.product?.name || 'Product'}
                            className="product-thumb"
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                          />
                        </td>
                        <td className="product-name">{item.product_variant?.product?.name || 'N/A'}</td>
                        <td>{item.product_variant?.color?.color_name || 'N/A'}</td>
                        <td>{item.product_variant?.size || 'N/A'}</td>
                        <td>{formatVND(item.price)}</td>
                        <td className="quantity">{item.quantity}</td>
                        <td className="total-price">{formatVND(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="order-info-section">
              <div className="section-header">
                <h3>💰 Thanh toán</h3>
              </div>
              <div className="payment-summary">
                <div className="summary-row">
                  <span className="label">Tổng tiền hàng:</span>
                  <span className="value">{formatVND(order.original_total)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Phí vận chuyển:</span>
                  <span className="value">{formatVND(order.shipping_fee || 0)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="summary-row discount">
                    <span className="label">Giảm giá:</span>
                    <span className="value">-{formatVND(order.discount_amount)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span className="label">Tổng thanh toán:</span>
                  <span className="value">{formatVND(order.final_total)}</span>
                </div>
              </div>
            </div>

            {/* Cập nhật trạng thái */}
            <div className="order-info-section">
              <div className="section-header">
                <h3>⚙️ Quản lý đơn hàng</h3>
              </div>
              <div className="order-action">
                <div className="action-group">
                  <label>Cập nhật trạng thái:</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <button className="btn-update" onClick={updateStatus}>
                    <i className="fas fa-check"></i> Cập nhật
                  </button>
                </div>
                {order.status === "cancelled" && (
                  <button className="btn-delete" onClick={deleteOrder}>
                    <i className="fas fa-trash"></i> Xóa đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
