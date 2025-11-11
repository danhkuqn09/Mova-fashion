import React, { useState, useEffect } from "react";
import "./Order.css";
import Banner from "./BannerOrder";
import Footer from "../Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // 🔹 Lấy dữ liệu giỏ hàng từ localStorage khi load trang
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // 🔹 Cập nhật localStorage khi thay đổi số lượng hoặc xóa sản phẩm
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔹 Thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Number(newQuantity)) }
          : item
      )
    );
  };

  // 🔹 Xóa sản phẩm
  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔹 Tính tổng tiền
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatVND = (value) => value.toLocaleString("vi-VN") + " ₫";

  return (
    <div className="cart-container">
      <Banner />

      <div className="cart-content">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  Đơn hàng của bạn đang trống 😢
                </td>
              </tr>
            ) : (
              cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="cart-product">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </td>
                  <td>{formatVND(item.price)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                    />
                  </td>
                  <td>{formatVND(item.price * item.quantity)}</td>
                  <td>
                    <i
                      className="fa-solid fa-trash-can delete-icon"
                      onClick={() => handleRemove(item.id)}
                    ></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Tổng tiền */}
        <div className="cart-summary">
          <h3>Tổng cộng</h3>
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{formatVND(totalPrice)}</span>
          </div>
          <div className="summary-row total">
            <span>Tổng</span>
            <span className="highlight">{formatVND(totalPrice)}</span>
          </div>
          <button className="checkout-btn">Thanh toán</button>
        </div>
      </div>

      {/* Dịch vụ */}
      <div className="cart-footer">
        <div className="service-item">
          <i className="fa-solid fa-trophy"></i>
          <div>
            <h4>Chất lượng cao</h4>
            <p>crafted from top materials</p>
          </div>
        </div>

        <div className="service-item">
          <i className="fa-solid fa-truck"></i>
          <div>
            <h4>Giao hàng miễn phí</h4>
            <p>Order over 150 $</p>
          </div>
        </div>

        <div className="service-item">
          <i className="fa-solid fa-headset"></i>
          <div>
            <h4>Hỗ trợ 24/7</h4>
            <p>Dedicated support</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
