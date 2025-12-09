import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Order.css";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm chuyển trạng thái sang tiếng Việt
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao hàng',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  // Hàm format tiền VNĐ
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem đơn hàng!");
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("📌 Dữ liệu trả về từ API /orders:", res.data);

        setOrders(res.data.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi tải đơn hàng:", error);
        setLoading(false);
      });

  }, []);

  const handleCancelOrder = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("Đã hủy đơn hàng!");
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id
              ? { ...order, status: "cancelled", justCancelled: true } : order
          )
        );
      }
    } catch (error) {
      console.error("Lỗi hủy đơn:", error);
      alert("Không thể hủy đơn hàng!");
    }
  };

  // const handleDeleteOrder = async (id) => {
  //   const token = localStorage.getItem("token");
  //   if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

  //   try {
  //     const res = await axios.delete(
  //       `http://localhost:8000/api/orders/${id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (res.data.success) {
  //       alert("Đã xóa đơn hàng!");
  //       setOrders((prev) => prev.filter((order) => order.id !== id));
  //     }
  //   } catch (error) {
  //     console.error("Lỗi xóa đơn:", error);
  //     alert("Không thể xóa đơn hàng!");
  //   }
  // };
  // Tính giảm giá từ voucher
  const getDiscountAmount = (order) => {
    if (!order.voucher) return 0;

    const originalTotal = Number(order.original_total || order.pricing?.original_total || 0);
    let discount = Math.round((originalTotal * order.voucher.discount_percent) / 100);

    if (order.voucher.max_discount_amount) {
      discount = Math.min(discount, order.voucher.max_discount_amount);
    }

    return discount;
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (orders.length === 0) return <p>Bạn chưa có đơn hàng nào 😢</p>;

  return (
    <div className="order-page">
      <h2>Danh sách đơn hàng của bạn</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-table-container">
          <div className="order-header">
            <span>Đơn hàng #{order.id}</span>
            <span>Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</span>
            <span className={`status-badge ${order.status.toLowerCase()}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          <table className="order-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => {
                console.log("ITEM TRONG ORDER:", item);
                return (
                  <tr key={item.id}>
                    <td>
                      {item.product_variant?.product?.image ? (
                        <img
                          src={`http://localhost:8000/storage/${item.product_variant?.product?.image}`}
                          alt={item.product_variant?.product?.name}
                          className="product-thumb"
                        />

                      ) : (
                        <span>Chưa có ảnh</span>
                      )}
                    </td>

                    <td>
                      {item.product_variant?.product?.name}
                      <br />
                      <small>Màu: {item.product_variant?.color?.color_name || "Không có màu"}</small>
                      <br />
                      <small>Size: {item.product_variant.size || "Không có size"}</small>
                    </td>
                    <td>{formatMoney(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatMoney(item.price * item.quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="order-footer">
            {order.voucher && (
              <div>
                <span>
                  Voucher ({order.voucher.code}): -{formatMoney(getDiscountAmount(order))}
                </span>
              </div>
            )}
            <span>
              Thành tiền: {formatMoney(order.final_total || order.pricing?.final_total || 0)}
            </span>

            <div className="order-actions">
              {(order.status === "pending" || order.status === "new") && (
                <button onClick={() => handleCancelOrder(order.id)} className="ordercancel-btn">
                  Hủy mua
                </button>
              )}
              {/* {order.status === "cancelled" || order.status === "completed" ? (
                <button onClick={() => handleDeleteOrder(order.id)} className="delete-btn">
                  Xóa đơn
                </button>
              ) : null} */}


              <Link to={`/order/${order.id}`}>
                <button className="orderdetail-btn">Xem chi tiết</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
