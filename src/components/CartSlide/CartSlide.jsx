import React, { useState, useEffect } from "react";
import "./CartSlide.css";
import { Link } from "react-router-dom";

// 🔹 Hàm định dạng tiền VNĐ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function CartSlide({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);

  // 🔹 Khi mở popup, đọc lại dữ liệu từ localStorage
  useEffect(() => {
    if (isOpen) {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCart);
    }
  }, [isOpen]);

  // 🔹 Tính tổng tiền
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 🔹 Hàm xóa sản phẩm
  const removeItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🔹 Ngăn click panel đóng overlay
  const handlePanelClick = (e) => e.stopPropagation();

  // 🔹 Class hiệu ứng mở
  const overlayClass = isOpen ? "cart-slide-overlay open" : "cart-slide-overlay";

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className="cart-slide-panel" onClick={handlePanelClick}>
        <div className="cart-header">
          <h2> Giỏ hàng của bạn</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Giỏ hàng trống.</p>
          ) : (
            cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>
                    Size: {item.size} • Màu:{<span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        margin: "0 4px",
                        border: "1px solid #ccc",
                      }}
                    ></span>}
                  </p>
                  <p>
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(index)}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal">
              <strong>Tổng:</strong>
              <strong className="subtotal-price">{formatCurrency(subtotal)}</strong>
            </div>
            <div className="action-buttons">
              <Link to="/order" className="action-btn" onClick={onClose}>
                Xem giỏ hàng
              </Link>
              <Link to="/checkout" className="action-btn" onClick={onClose}>
                Thanh toán
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartSlide;
