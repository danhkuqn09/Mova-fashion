import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css";
const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem đơn hàng!");
      window.location.href = "/login";
      return;
    }

    axios.get("http://localhost:8000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setOrders(res.data.data.data || []);
        setLoading(false);
        console.log("API trả về:", res.data);
      })
      .catch((error) => {
        console.error("Lỗi tải đơn hàng:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải đơn hàng...</p>;

  if (orders.length === 0)
    return <p>Bạn chưa có đơn hàng nào 😢</p>;

  return (
    <div className="order-page">
      <h2>Danh sách đơn hàng của bạn</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Đơn #{order.id}</h3>
          <p>Ngày đặt: {new Date(order.created_at).toLocaleString()}</p>
          <p>Trạng thái: {order.status}</p>
          <p>Tổng tiền: {Number(order.final_total).toLocaleString("vi-VN")} ₫</p>
          <div className="order-items">
            {order.items?.map((item) => (
              <div key={item.id}>
                {item.product_variant?.product?.name} × {item.quantity}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
