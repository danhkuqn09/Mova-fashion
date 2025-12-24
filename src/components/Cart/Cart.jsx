import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import axios from "axios";

// 🔹 Hàm định dạng tiền VNĐ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Danh sách item được chọn để thanh toán
  const [selectedItems, setSelectedItems] = useState([]);

  // 🔹 Load giỏ hàng từ API khi mở trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem giỏ hàng!");
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    axios
      .get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const cartData = res.data?.data?.items || [];
        console.log("Cart items with stock:", cartData);
        setCartItems(cartData);
        // Mặc định chọn tất cả sản phẩm
        setSelectedItems(cartData.map((item) => item.id));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải giỏ hàng:", error);
        setLoading(false);
        if (error.response?.status === 401) {
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      });
  }, []);

  // 🔹 Toggle chọn sản phẩm
  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 🔹 Chọn tất cả
  const selectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // bỏ chọn tất cả
    } else {
      setSelectedItems(cartItems.map((item) => item.id)); // chọn hết
    }
  };

  // 🔹 Tổng tiền các sản phẩm được chọn
  const selectedSubtotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  // 🔹 Xóa sản phẩm
  const removeItem = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(cartItems.filter((item) => item.id !== itemId));
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      
      // Phát sự kiện để cập nhật số lượng giỏ hàng ở Header
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng!");
    }
  };

  // 🔹 Cập nhật số lượng
  const updateQuantity = async (itemId, type) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Tìm item hiện tại TRƯỚC khi update state
    const currentItem = cartItems.find((i) => i.id === itemId);
    if (!currentItem) return;

    let newQty = currentItem.quantity;
    if (type === "increase") {
      // Kiểm tra tồn kho trước khi tăng
      const stockQty = currentItem.variant?.quantity || 0;
      if (newQty >= stockQty) {
        alert(`Sản phẩm chỉ còn ${stockQty} sản phẩm trong kho!`);
        return;
      }
      newQty++;
    } else if (type === "decrease") {
      if (newQty === 1) {
        removeItem(itemId);
        return;
      }
      newQty--;
    }

    // Update UI optimistically
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );

    try {
      await axios.put(
        `http://localhost:8000/api/cart/${itemId}`,
        { quantity: newQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Phát sự kiện để cập nhật số lượng giỏ hàng ở Header
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      const errorMsg = error.response?.data?.message || "Không thể cập nhật số lượng!";
      alert(errorMsg);
      
      // Rollback nếu API thất bại
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: currentItem.quantity } : item
        )
      );
    }
  };

  // 🔹 Hiển thị Loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // 🔹 Giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Giỏ hàng của bạn trống</h2>
        <Link to="/">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  // 🔹 Giao diện chính
  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>🛒 Giỏ hàng của bạn</h2>
        <span className="cart-count">({cartItems.length} sản phẩm)</span>
      </div>

      {/* Chọn tất cả */}
      <div className="select-all-box">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="styled-checkbox"
            checked={selectedItems.length === cartItems.length}
            onChange={selectAll}
          />
          <span className="checkbox-text">Chọn tất cả ({selectedItems.length}/{cartItems.length})</span>
        </label>
      </div>

      <div className="cart-items-container">
        {cartItems.map((item) => (
          <div className={`cart-item ${selectedItems.includes(item.id) ? 'selected' : ''}`} key={item.id}>
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                className="select-item-checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelectItem(item.id)}
              />
              <span className="checkmark"></span>
            </label>

            {item.product && (
              <img
                src={`http://localhost:8000/storage/${item.product.image}`}
                alt={item.product.name}
                className="item-image"
              />
            )}
            <div className="item-details">
              <h3 className="item-name">{item.product ? item.product.name : 'Không rõ sản phẩm'}</h3>
              <div className="item-variants">
                <span className="variant-badge">
                  <i className="fas fa-ruler-combined"></i> Size: {(() => {
                    if (item.variant && typeof item.variant === 'object' && 'size' in item.variant && item.variant.size) {
                      const sizeVal = item.variant.size;
                      if (typeof sizeVal === 'object' && sizeVal !== null && !Array.isArray(sizeVal)) {
                        if (typeof sizeVal.name === 'string' && sizeVal.name) return sizeVal.name;
                        return 'Không rõ';
                      } else if (typeof sizeVal === 'string' || typeof sizeVal === 'number') {
                        return String(sizeVal);
                      }
                      return 'Không rõ';
                    }
                    return 'Không rõ';
                  })()}
                </span>
                <span className="variant-badge">
                  <span
                    className="color-dot"
                    style={{
                      backgroundColor: item.variant && typeof item.variant === 'object' && 'color_code' in item.variant && item.variant.color_code ? item.variant.color_code : '#ccc',
                    }}
                  ></span>
                  {(() => {
                    if (item.variant && typeof item.variant === 'object' && 'color' in item.variant && item.variant.color) {
                      const colorVal = item.variant.color;
                      if (typeof colorVal === 'object' && colorVal !== null && !Array.isArray(colorVal)) {
                        if (typeof colorVal.name === 'string' && colorVal.name) return colorVal.name;
                        if (typeof colorVal.hex_code === 'string' && colorVal.hex_code) return colorVal.hex_code;
                        return 'Không rõ';
                      } else if (typeof colorVal === 'string' || typeof colorVal === 'number') {
                        return String(colorVal);
                      }
                      return 'Không rõ';
                    }
                    return 'Không rõ';
                  })()}
                </span>
              </div>

              <div className="item-price-row">
                <span className="unit-price">{formatCurrency(item.price)}</span>
                {item.variant?.quantity > 0 && (
                  <span className="stock-info" style={{ fontSize: '0.85rem', color: '#7f8c8d', marginLeft: '10px' }}>
                    (Còn {item.variant.quantity} sản phẩm)
                  </span>
                )}
              </div>
            </div>

            <div className="item-actions">
              <div className="quantity-control">
                <button 
                  className="qty-btn" 
                  onClick={() => updateQuantity(item.id, "decrease")}
                  disabled={item.quantity === 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input type="text" className="qty-input" value={item.quantity} readOnly />
                <button 
                  className="qty-btn" 
                  onClick={() => updateQuantity(item.id, "increase")}
                  disabled={item.quantity >= (item.variant?.quantity || 0)}
                  title={item.quantity >= (item.variant?.quantity || 0) ? 'Hết hàng trong kho' : 'Tăng số lượng'}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>

              <div className="item-total">
                <span className="total-label">Thành tiền:</span>
                <span className="total-price">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>

            <button className="remove-item-btn" onClick={() => removeItem(item.id)} title="Xóa sản phẩm">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
      </div>

      {/* 🔹 Tổng tiền sản phẩm được chọn */}
      <div className="cart-summary">
        <h3>
          Tổng cộng:{" "}
          {selectedItems.length === 0
            ? "0₫"
            : formatCurrency(selectedSubtotal)}
        </h3>

        {/* 🔹 Nút Checkout – chỉ cho thanh toán nếu có sản phẩm được chọn */}
        <Link
          to="/checkout"
          state={{
            selectedIds: selectedItems,
            cartItems: cartItems.filter((i) => selectedItems.includes(i.id)),
            subtotal: selectedSubtotal,
          }}
          className={`checkout-btn ${selectedItems.length === 0 ? "disabled" : ""
            }`}
          onClick={(e) => {
            if (selectedItems.length === 0) {
              e.preventDefault();
              alert("Hãy chọn ít nhất 1 sản phẩm để thanh toán!");
            }
          }}
        >
          Thanh toán
        </Link>

        <Link to="/" className="continue-btn">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
