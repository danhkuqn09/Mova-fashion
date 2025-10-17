import React, { useState, useMemo } from "react";
import CartItem from "./CartItem";

const CartPage = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Áo thun T-Shirt",
      price: 365000,
      quantity: 1,
      image:
        "https://down-vn.img.susercontent.com/file/sg-11134201-7rbl3-m0m3t1mv6tg75a",
    },
    // bạn có thể thêm sản phẩm mẫu khác ở đây
  ]);

  const increaseQty = (id) =>
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
    );

  const removeItem = (id) => setCart((prev) => prev.filter((p) => p.id !== id));

  const subtotal = useMemo(
    () => cart.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [cart]
  );

  return (
    <main className="cart-wrap">
      <div className="cart-inner">
        <section className="cart-table">
          <div className="table-header">
            <div className="th product">Sản Phẩm</div>
            <div className="th price">Giá</div>
            <div className="th qty">Số Lượng</div>
            <div className="th total">Giá tiền</div>
          </div>

          <div className="table-body">
            {cart.length === 0 ? (
              <div className="empty">Giỏ hàng đang trống.</div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  removeItem={removeItem}
                />
              ))
            )}
          </div>
        </section>

        <aside className="cart-summary">
          <h3>Tổng</h3>
          <div className="summary-row">
            <span>Giá tiền</span>
            <span className="muted">{subtotal.toLocaleString()} VND</span>
          </div>
          <div className="summary-row total">
            <span>Tổng</span>
            <span>{subtotal.toLocaleString()} VND</span>
          </div>
          <button className="checkout">Thanh Toán</button>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
