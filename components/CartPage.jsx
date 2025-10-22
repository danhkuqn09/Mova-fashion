import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';

// Hàm định dạng tiền tệ (chuyển số sang chuỗi VNĐ)
const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', { 
    style: 'currency', 
    currency: 'VND', 
    minimumFractionDigits: 0 
  });
};

const CartPage = () => {
  // 1. Khởi tạo State cho giỏ hàng
  // Dữ liệu ban đầu phải là số để tính toán
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Áo thun T-Shirt',
      price: 365000,
      quantity: 1,
      imagePlaceholder: 'T-Shirt', 
    },
    {
      id: 2,
      name: 'Áo Hoodie Essential',
      price: 599000,
      quantity: 2,
      imagePlaceholder: 'Hoodie', 
    },
  ]);

  // 2. Tính toán Tổng tiền hàng (Subtotal)
  // Tính toán lại chỉ khi cartItems thay đổi
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);
  
  const formattedSubtotal = formatCurrency(subtotal);

  // 3. Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (itemId, changeType) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          let newQuantity = item.quantity;
          if (changeType === 'increment') {
            newQuantity += 1;
          } else if (changeType === 'decrement' && item.quantity > 1) {
            newQuantity -= 1;
          }
          // Ngăn số lượng giảm xuống dưới 1
          if (newQuantity < 1) newQuantity = 1;

          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // 4. Hàm xóa sản phẩm
  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    // Dùng class 'main-content-wrapper' cho banner nền
    <div className="main-content-wrapper2 cart-wrapper"> 
      
      {/* Page Banner Header (Bạn cần định nghĩa style cho nó trong CSS) */}
      <div className="page-header-banner">
        {/* Placeholder: Bạn có thể thay thế bằng giao diện banner thực tế */}
        <h1 style={{color: 'white', fontSize: '3rem'}}>Giỏ Hàng Của Bạn</h1> 
        <p className="breadcrumb" style={{color: '#ddd'}}>Trang Chủ / Giỏ Hàng</p>
      </div>

      <div className="cart-page-container">
        
        {/* Cột 1: Chi tiết Sản phẩm */}
        <div className="cart-details-column">
          
          <div className="product-summary-header">
            <span style={{textAlign: 'left'}}>SẢN PHẨM</span>
            <span>GIÁ</span>
            <span>SỐ LƯỢNG</span>
            <span style={{textAlign: 'right'}}>TỔNG CỘNG</span>
          </div>

          {/* Dùng .map để render danh sách sản phẩm */}
          {cartItems.length === 0 ? (
            <div className="empty-cart-message" style={{padding: '30px', textAlign: 'center', border: '1px solid #ddd', marginTop: '10px'}}>
                Giỏ hàng của bạn đang trống.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                {/* 1. Sản Phẩm (Tên và Ảnh) */}
                <div className="item-product">
                  <div className="item-image-placeholder">
                      <span>{item.imagePlaceholder}</span>
                  </div>
                  <span className="item-name">{item.name}</span>
                </div>
                
                {/* 2. Giá Đơn vị */}
                <span className="col-info">{formatCurrency(item.price)}</span>
                
                {/* 3. CONTROL SỐ LƯỢNG */}
                <span className="col-info quantity-control-wrapper">
                  <div className="quantity-control">
                    <button 
                      onClick={() => handleQuantityChange(item.id, 'decrement')}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, 'increment')}
                      className="quantity-btn"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </span>
                
                {/* 4. TỔNG TIỀN CỦA SẢN PHẨM (Đã cập nhật) */}
                <span className="total-item-price">
                  {formatCurrency(item.price * item.quantity)}
                  <span 
                    className="remove-icon" 
                    onClick={() => handleRemoveItem(item.id)}
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={18} />
                  </span>
                </span>
              </div>
            ))
          )}
          
        </div>

        {/* Cột 2: Tổng thanh toán */}
        <div className="cart-total-column">
          <h2>TỔNG THANH TOÁN</h2>
          
          <div className="total-row">
            <span className="label">Tổng tiền hàng</span>
            <span className="value">{formattedSubtotal}</span>
          </div>
          
          <div className="total-row">
            <span className="label">Giảm giá</span>
            <span className="value">0 VND</span>
          </div>
          
          <div className="total-row">
            <span className="label">Phí vận chuyển</span>
            <span className="value">Miễn phí</span>
          </div>
          
          {/* TỔNG CỘNG CUỐI CÙNG (Đã cập nhật) */}
          <div className="total-row final-total">
            <span className="label">TỔNG CỘNG</span>
            <span className="value">{formattedSubtotal}</span>
          </div>
          
          <button className="checkout-button">TIẾN HÀNH THANH TOÁN</button>
          
          <div className="continue-shopping">
            {/* Giả sử bạn đang dùng React Router, Link sẽ hoạt động */}
            <Link to="/store">Tiếp tục mua sắm</Link> 
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CartPage;