import React from "react";
import "./CartSlide.css";
import { Link } from "react-router-dom"; // Dùng Link để điều hướng


import productImage from "/Image/aoKhoacDaNu.jpg"; 


const mockCartItems = [
  {
    id: 1,
    name: "Áo khoác dạ nữ",
    price: 365000,
    quantity: 1,
    image: productImage, // Dùng ảnh đã import
  },
  
];

// Định dạng tiền tệ VNĐ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function CartSlide({ isOpen, onClose }) {
  // Tính tổng tiền
  const subtotal = mockCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Ngăn việc nhấn vào panel làm đóng giỏ hàng
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  // Thêm class 'open' khi 'isOpen' là true
  const overlayClass = isOpen ? "cart-slide-overlay open" : "cart-slide-overlay";

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className="cart-slide-panel" onClick={handlePanelClick}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>
            &times; {/* Đây là dấu 'X' */}
          </button>
        </div>

        <div className="cart-body">
          {mockCartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>
                  {item.quantity} X {formatCurrency(item.price)}
                </p>
              </div>
              <button className="remove-item-btn">&times;</button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="subtotal">
            <strong>Subtotal</strong>
            <strong className="subtotal-price">{formatCurrency(subtotal)}</strong>
          </div>
          <div className="action-buttons">
            <Link to="/cart" className="action-btn" onClick={onClose}>
              Cart
            </Link>
            <Link to="/checkout" className="action-btn" onClick={onClose}>
              Checkout
            </Link>
            <Link to="/comparison" className="action-btn" onClick={onClose}>
              Comparison
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSlide;