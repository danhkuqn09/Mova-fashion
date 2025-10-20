import React, { useState } from "react";
import "./cart.css";
import TshirtImg from "../ProductDetail/Image/VestNauDetail1.jpg"; // thay đường dẫn ảnh phù hợp
import Header from "../Header";
import Banner from "./BannerCart";
import Footer from "../Footer";
const Cart = () => {
  const [quantity, setQuantity] = useState(1);

  const price = 365000;
  const total = price * quantity;

  return (
    <div className="cart-container">
      <Header />
      <Banner />
      {/* Phần nội dung chính */}
      <div className="cart-content">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sản Phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Giá tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cart-product">
                <img src={TshirtImg} alt="Áo thun T-Shirt" />
                <span>Áo thun T-Shirt</span>
              </td>
              <td>{price.toLocaleString()} VND</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </td>
              <td>{total.toLocaleString()} VND</td>
              <td>
                <i className="fa-solid fa-trash-can delete-icon"></i>
              </td>
            </tr>
            
          </tbody>
        </table>

        

        {/* Tổng tiền */}
        <div className="cart-summary">
          <h3>Tổng</h3>
          <div className="summary-row">
            <span>Giá tiền</span>
            <span>{price.toLocaleString()} VND</span>
          </div>
          <div className="summary-row total">
            <span>Tổng</span>
            <span className="highlight">{total.toLocaleString()} VND</span>
          </div>
          <button className="checkout-btn">Thanh Toán</button>
        </div>
      </div>

      {/* Phần thông tin dịch vụ */}
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
            <h4>Hỗ trợ 24 / 7</h4>
            <p>Dedicated support</p>
          </div>
        </div>
      </div>
        <Footer />
    </div>
  );
};

export default Cart;
