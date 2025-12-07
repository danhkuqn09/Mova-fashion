import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://localhost:8000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📌 CHI TIẾT ĐƠN HÀNG API:", res.data);
        // Dựa vào Controller: response()->json(['data' => $orderData])
        setOrder(res.data.data);
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err);
        setError("Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <div className="loading">Đang tải chi tiết...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="order-detail-container">
      <Link to="/order" className="back-link">← Quay lại danh sách</Link>

      <div className="order-header">
        <h2>Chi tiết đơn hàng #{order.id}</h2>
        <span className={`status-badge ${order.status}`}>
          {order.status_text || order.status}
        </span>
      </div>

      <div className="order-info-grid">
        <div className="info-col">
          <h3>Thông tin người nhận</h3>
          <p><strong>Họ tên:</strong> {order.customer_info?.name}</p>
          <p><strong>Số điện thoại:</strong> {order.customer_info?.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.customer_info?.address}</p>
        </div>
        <div className="info-col">
          <h3>Thông tin đơn hàng</h3>
          <p><strong>Mã đơn:</strong> {order.order_code}</p>
          <p><strong>Ngày đặt:</strong> {order.created_at}</p>
          <p><strong>Thanh toán:</strong> {order.payment_method_text} ({order.payment_status})</p>
        </div>
      </div>

      <h3>Sản phẩm đã đặt</h3>
      <div className="table-responsive">
        <table className="detail-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.product.image && (
                    <img
                      src={`http://localhost:8000${item.product.image}`}
                      alt={item.product.name}
                      className="product-image"
                    />
                  )}
                </td>
                <td>
                  <span>{item.product.name}</span> <br />
                  Size: {item.variant?.size || "Không có"} <br />
                  Màu: {item.variant?.color || "Không có"}
                </td>
                <td>{Number(item.price).toLocaleString("vi-VN")} ₫</td>
                <td>{item.quantity}</td>
                <td>{Number(item.subtotal).toLocaleString("vi-VN")} ₫</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="order-summary">
        {/* <div className="summary-row">
          <span>Tạm tính:</span>
          <span>{Number(order.pricing?.original_total).toLocaleString("vi-VN")} ₫</span>
        </div> */}
        {order.pricing?.discount_amount > 0 && (
          <div className="summary-row discount">
            <span>Giảm giá:</span>
            <span>-{Number(order.pricing.discount_amount).toLocaleString("vi-VN")} ₫</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Tổng cộng:</span>
          <span>{Number(order.pricing?.final_total).toLocaleString("vi-VN")} ₫</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;