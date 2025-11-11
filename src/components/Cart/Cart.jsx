import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import Footer from "../Footer";
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
  const [loading, setLoading] = useState(true); // 👈 thêm state loading

  // 🔹 Load giỏ hàng từ API khi mở trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem giỏ hàng!");
      window.location.href = "/login";
      return;
    }

    setLoading(true); // 👈 bắt đầu loading

    axios
      .get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const cartData = res.data?.data?.items || [];
        setCartItems(cartData);
        setLoading(false); // ✅ kết thúc loading
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

  // 🔹 Tính tổng tiền
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 🔹 Xóa sản phẩm
  const removeItem = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(cartItems.filter((item) => item.id !== itemId));
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

  // 👉 Gọi API phía sau, không chặn UI
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

  // 🔹 Khi giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Giỏ hàng của bạn trống</h2>
        <Link to="/">Tiếp tục mua sắm</Link>
        <Footer />
      </div>
    );
  }

  // 🔹 Giao diện giỏ hàng chính
  return (
    <div className="cart-page">
      <h2>Giỏ hàng của bạn</h2>

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
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
              <button onClick={() => updateQuantity(item.id, "decrease")}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, "increase")}>+</button>
            </div>

            <p>
              {formatCurrency(item.price)} × {item.quantity} ={" "}
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </p>
          </div>
          <button
            className="remove-item-btn"
            onClick={() => removeItem(item.id)}
          >
            &times;
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Tổng cộng: {formatCurrency(subtotal)}</h3>
        <Link to="/checkout" className="checkout-btn">
          Thanh toán
        </Link>
        <Link to="/" className="continue-btn">
          Tiếp tục mua sắm
        </Link>
      </div>

      <Footer />
    </div>
  );
}

export default CartPage;
