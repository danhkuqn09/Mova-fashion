import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import Banner from "./BannerCheckout";

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

  const [voucher, setVoucher] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    payment_method: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.email ||
      !form.payment_method
    ) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin và chọn phương thức thanh toán!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        payment_method: form.payment_method,
        cart_item_ids: cartItems.map(item => item.id), 
      };


      console.log("Payload gửi lên:", payload);

      const res = await axios.post( "http://localhost:8000/api/orders", payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        alert("Đặt hàng thành công!");
        navigate("/order");
      } else {
        alert("Đặt hàng thất bại.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Lỗi:", error.response.data);
        const err = error.response.data;

        if (err.errors) {
          const messages = Object.values(err.errors).flat().join("\n");
          alert("Lỗi xác thực:\n" + messages);
        } else {
          alert("Lỗi: " + (err.message || "Lỗi không xác định từ server"));
        }
      } else {
        alert("Không thể kết nối server.");
      }
    } finally {
      setLoading(false);
    }
   
  };  
  // Thanh toán = MOMO
// const handleMomoPayment = async () => {

//   const token = localStorage.getItem("token");
//   const payload = {
//     amount: subtotal,
//     cart_item_ids: cartItems.map(i => i.id),
//   };
//   try {
//     const res = await axios.post(
//       "http://localhost:8000/api/momo/payment",
//       payload,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     if (res.data.payUrl) {
//       window.location.href = res.data.payUrl; // Redirect sang MOMO
//     } else {
//       alert("Không tạo được link thanh toán MOMO");
//     }
//   } catch (err) {
//     console.log(err);
//     alert("Lỗi khi tạo thanh toán MOMO");
//   }
// };


  return (
    <div className="main-content-wrapper2">
      <Banner />

      <div className="checkout-page-container">

        {/* Cột form */}
        <div className="checkout-form-column">
          <h2>Thông tin người nhận</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <label>Họ và tên</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ tên..."
              disabled={loading}
            />

            <label>Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              disabled={loading}
            />

            <label>Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ nhận hàng..."
              disabled={loading}
            />

            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email..."
              disabled={loading}
            />

            <label>Phương thức thanh toán</label>

            <div className="payment-options">

              <label className={`payment-item ${form.payment_method === "momo" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="momo"
                  checked={form.payment_method === "momo"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <img src="/Image/MOMO.png" alt="momo" />
                <span>Thanh toán MOMO</span>
              </label>

              <label className={`payment-item ${form.payment_method === "vnpay" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="vnpay"
                  checked={form.payment_method === "vnpay"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <img src="/Image/VNPAY.png" alt="VNPAY" />
                <span>Thanh toán VNPay</span>
              </label>

              <label className={`payment-item ${form.payment_method === "COD" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={form.payment_method === "COD"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <img src="/Image/COD.jpg" alt="COD" />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
            </div>

            {/* Voucher */}
            <div className="voucher-box">
              <input
                type="text"
                placeholder="Nhập mã giảm giá..."
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <button
                type="button"
                className="apply-voucher-btn"
                onClick={() => alert("Tính năng Voucher chưa kết nối API!")}
              >
                Áp dụng
              </button>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "ĐẶT HÀNG"}
            </button>



          </form>

        </div>
        {/* Cột đơn hàng */}
        <div className="checkout-summary-column">
          <h3>Đơn hàng của bạn</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="checkout-summary-row">
              <span>
                {item.product?.name || item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          <div className="checkout-summary-row total">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
