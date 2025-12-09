import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import Banner from "./BannerCheckout";

const formatCurrency = (amount) =>
  amount.toLocaleString("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 });

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
 const { buyNow = false, item = null, cartItems = [], subtotal = 0 } = location.state || {};




  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment_method: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.email || !form.payment_method) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
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

      let payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        payment_method: form.payment_method,
        voucher_code: voucher || null,
      };

      if (buyNow && item) {
        // BUY NOW
        payload.product_variant_id = item.product_variant_id;
        payload.quantity = item.quantity;
      } else {
        // CHECKOUT GIỎ HÀNG
        payload.cart_item_ids = cartItems.map((i) => i.id);
      }

      // mua ngay
      const url = buyNow
        ? "http://localhost:8000/api/orders/buy-now"
        : "http://localhost:8000/api/orders";

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (res.data.success) {
        if (res.data.data.payment_method === "momo" && res.data.data.payment_url) {
          // Chuyển sang MOMO
          window.location.href = res.data.data.payment_url;
        } else if (res.data.data.payment_method === "payos" && res.data.data.payment_url) {
          // Chuyển sang PayOS nếu cần
          window.location.href = res.data.data.payment_url;
        } else {
          alert("Đặt hàng thành công!");
          navigate("/order");
        }
      } else {
        alert("Đặt hàng thất bại!");
      }
    } catch (error) {
      console.error(error.response?.data);
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat().join("\n");
        alert("Lỗi xác thực:\n" + messages);
      } else {
        alert("Lỗi server khi đặt hàng!");
      }
    } finally {
      setLoading(false);
    }
  };
  const [voucher, setVoucher] = useState("");
  const [voucherInfo, setVoucherInfo] = useState(null); // lưu thông tin giảm giá
  const [discountAmount, setDiscountAmount] = useState(0); // lưu số tiền giảm giá
  const handleApplyVoucher = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để sử dụng voucher!");
      navigate("/login");
      return;
    }
    if (!voucher) {
      alert("Vui lòng nhập mã voucher!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/vouchers/check", {
        code: voucher,
        order_total: subtotal,  // tổng đơn hàng
      },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const data = res.data.data;

        setVoucherInfo(data);
        setDiscountAmount(data.discount_amount);

        alert("Áp dụng voucher thành công!");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Không thể áp dụng voucher!");
      }

      setVoucherInfo(null);
      setDiscountAmount(0);
    }
    console.log("Subtotal gửi lên check voucher:", subtotal);

  };

  return (
    <div className="main-content-wrapper2">
      <Banner />
      <div className="checkout-page-container">
        <div className="checkout-form-column">
          <h2>Thông tin người nhận</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <label>Họ và tên</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nhập họ tên..." disabled={loading} />
            <label>Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại..." disabled={loading} />
            <label>Địa chỉ</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Nhập địa chỉ..." disabled={loading} />
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Nhập email..." disabled={loading} />

            <label>Phương thức thanh toán</label>
            <div className="payment-options">
              <label className={`payment-item ${form.payment_method === "momo" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="momo"
                  checked={form.payment_method === "momo"}
                  onChange={handleChange}
                />
                <img src="/Image/MOMO.png" alt="momo" />
                <span>Thanh toán MOMO</span>
              </label>

              <label className={`payment-item ${form.payment_method === "COD" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={form.payment_method === "COD"}
                  onChange={handleChange}
                />
                <img src="/Image/COD1.jpg" alt="COD" />
                <span>Thanh toán khi nhận hàng</span>
              </label>
            </div>

            <div className="voucher-box">
              <input type="text" placeholder="Nhập mã giảm giá..." value={voucher} onChange={(e) => setVoucher(e.target.value)} />
              <button
                type="button"
                className="apply-voucher-btn"
                onClick={handleApplyVoucher} >
                Áp dụng
              </button>

            </div>
            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "ĐẶT HÀNG"}
            </button>
          </form>
        </div>

        <div className="checkout-summary-column">
          <h3>Đơn hàng của bạn</h3>

          {buyNow && item ? (
            <div className="checkout-summary-row">
              <span>{item.name} × {item.quantity}</span>
             <span>{formatCurrency(item.price * item.quantity)}</span>

            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="checkout-summary-row">
                <span>{item.product?.name || item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>

              </div>
            ))
          )}
          {voucherInfo && (
            <div className="checkout-summary-row discount">
              <span>Voucher ({voucherInfo.voucher.code}):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="checkout-summary-row total">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(subtotal - discountAmount)}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;