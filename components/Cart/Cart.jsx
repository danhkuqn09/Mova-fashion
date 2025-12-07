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
  const [selectedItems, setSelectedItems] = useState([]);

  // 🔹 THÊM STATE QUẢN LÝ MODAL
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // 🔹 COMPONENT MODAL/POP-UP NỘI BỘ
  const NoItemSelectedModal = ({ show, onClose }) => {
    if (!show) {
      return null;
    }
    return (
      // Lớp nền tối (backdrop)
      <div className="custom-modal-backdrop" onClick={onClose}>
        {/* Nội dung thông báo, ngăn chặn click từ nền */}
        <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">Lỗi Thanh toán</h4>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <p>
              Bạn phải chọn ít nhất **1 sản phẩm** trong giỏ hàng để có thể tiến hành thanh toán.
            </p>
            <p>
              Vui lòng chọn sản phẩm và thử lại!
            </p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="button-ok">Đóng</button>
          </div>
        </div>
      </div>
    );
  };
  
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
        setCartItems(cartData);
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
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng!");
    }
  };

  // 🔹 Cập nhật số lượng
  const updateQuantity = async (itemId, type) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setCartItems((prevCart) =>
      prevCart.map((item) => {
        if (item.id === itemId) {
          let newQty = item.quantity;
          if (type === "increase") newQty++;
          else if (type === "decrease" && newQty > 1) newQty--;
          else if (type === "decrease" && newQty === 1) {
            removeItem(item.id);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    try {
      const currentItem = cartItems.find((i) => i.id === itemId);
      let newQty = currentItem.quantity;
      if (type === "increase") newQty++;
      else if (type === "decrease" && newQty > 1) newQty--;

      await axios.put(
        `http://localhost:8000/api/cart/${itemId}`,
        { quantity: newQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      alert("Không thể cập nhật số lượng!");
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
      <h2>Giỏ hàng của bạn</h2>

      {/* Chọn tất cả */}
      <div className="select-all-box">
        <input
          type="checkbox"
          className="styled-checkbox"
          checked={selectedItems.length === cartItems.length}
          onChange={selectAll}
        />
        <span>Chọn tất cả</span>
      </div>

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          {/* Chọn 1 sản phẩm*/}
          <input
            type="checkbox"
            className="select-item-checkbox checkbox-left"
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleSelectItem(item.id)}
          />

          <img
            src={`http://localhost:8000/storage/${item.product.image}`}
            alt={item.product.name}
            className="item-image"
          />
          <div className="item-details">
            <h3>{item.product.name}</h3>
            <p>
              Size: {item.variant.size} • Màu:{" "}
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  backgroundColor: item.variant.color_code,
                  borderRadius: "50%",
                  margin: "0 4px",
                  border: "1px solid #ccc",
                }}
              ></span>
              {item.variant.color}
            </p>

            <div className="quantity-control">
              <button onClick={() => updateQuantity(item.id, "decrease")}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, "increase")}>
                +
              </button>
            </div>

            <p>
              {formatCurrency(item.price)} × {item.quantity} ={" "}
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </p>
          </div>

          <button className="remove-item-btn" onClick={() => removeItem(item.id)}>
            &times;
          </button>
        </div>
      ))}

      {/* 🔹 Tổng tiền sản phẩm được chọn */}
      <div className="cart-summary">
        <h3>
          Tổng cộng:{" "}
          {selectedItems.length === 0
            ? "0₫"
            : formatCurrency(selectedSubtotal)}
        </h3>

        {/* 🔹 Nút Checkout – THAY THẾ alert() BẰNG HIỂN THỊ MODAL */}
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
              // Kích hoạt Modal thay vì alert()
              setShowCheckoutModal(true);
            }
          }}
        >
          Thanh toán
        </Link>

        <Link to="/" className="continue-btn">
          Tiếp tục mua sắm
        </Link>
      </div>
      
      {/* 🔹 RENDER MODAL TÙY CHỈNH */}
      <NoItemSelectedModal 
        show={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />
    </div>
  );
}

export default CartPage;