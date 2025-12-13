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

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder(res.data.data);
      setStatus(res.data.data.status);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Cập nhật trạng thái thành công!");
      fetchOrder();
    } catch (err) {
      console.error("Lỗi cập nhật", err);
      alert("Lỗi cập nhật trạng thái");
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

          <h1>Chi tiết đơn hàng #{id}</h1>

          <div className="order-detail-box">
            <p><b>Khách hàng:</b> {order.user?.name}</p>
            <p><b>Email:</b> {order.user?.email}</p>
            <p><b>Trạng thái:</b> {order.status}</p>
            <p><b>Thanh toán:</b> {order.payment_method}</p>
            <p><b>Tổng tiền:</b> {order.final_total.toLocaleString()}₫</p>
            <p><b>Discount:</b> {order.discount_amount?.toLocaleString() || 0}₫</p>

            <h3>Danh sách sản phẩm</h3>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="item-card">
                  <p>{item.productVariant?.product?.name}</p>
                  <p>Số lượng: {item.quantity}</p>
                  <p>Giá: {item.price.toLocaleString()}₫</p>
                </div>
              ))}
            </div>

            {/* Update Status */}
            <div className="order-action">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang giao hàng</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>

              <button onClick={updateStatus}>Cập nhật trạng thái</button>

              {order.status === "cancelled" && (
                <button className="btn-delete" onClick={deleteOrder}>
                  Xóa đơn hàng
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
