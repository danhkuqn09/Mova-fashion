import React from "react";

const CartItem = ({ item, increaseQty, decreaseQty, removeItem }) => {
  return (
    <div className="cart-row">
      <div className="product-cell">
        <img src={item.image} alt={item.name} />
        <div className="prod-info">
          <div className="prod-name">{item.name}</div>
        </div>
      </div>

      <div className="price-cell">{item.price.toLocaleString()} VND</div>

      <div className="qty-cell">
        <div className="qty-control">
          <button onClick={() => decreaseQty(item.id)}>-</button>
          <input readOnly value={item.quantity} />
          <button onClick={() => increaseQty(item.id)}>+</button>
        </div>
      </div>

      <div className="total-cell">
        <div>{(item.price * item.quantity).toLocaleString()} VND</div>
        <button className="trash" onClick={() => removeItem(item.id)}>🗑️</button>
      </div>
    </div>
  );
};

export default CartItem;
