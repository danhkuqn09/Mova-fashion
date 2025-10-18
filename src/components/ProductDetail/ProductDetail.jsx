import React, { useState } from "react";

import { Link } from "react-router-dom";
import Header from "../Header";
import Banner from "./Banner";
import Footer from "../Footer";
import "./ProductDetail.css";
import VestNauDetail1 from "./Image/VestNauDetail1.jpg";
import VestNauDetail2 from "./Image/VestNauDetail2.jpg";
import VestNauMain from "/Image/vestNuNau.jpg"; 

function ProductDetail() {
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("#c98d48");

  // ✅ State để lưu ảnh chính đang hiển thị
  const [mainImage, setMainImage] = useState(VestNauMain);

  const thumbnails = [VestNauDetail1, VestNauDetail2, VestNauMain];

  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  return (
    <div className="ProductDetail">
      <Header />
      <Banner />

      {/* 🔽 --- CHI TIẾT SẢN PHẨM --- 🔽 */}
      <div className="product-detail">
        <div className="product-gallery">
          <div className="thumbnails">
            {thumbnails.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb${index}`}
                className={mainImage === img ? "active" : ""}
                onClick={() => setMainImage(img)} // ✅ click đổi hình chính
              />
            ))}
          </div>

          <div className="main-image">
            <img src={mainImage} alt="main product" />
          </div>
        </div>

        <div className="product-info">
          <h2>Áo Thun T-Shirts</h2>
          <p className="price">365.000 VND</p>

          <div className="rating">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <p>5 Customer Review</p>
          </div>

          <p className="product-description">
            Thoải mái, trẻ trung, năng động phù hợp với mọi thời tiết.
          </p>

          <div className="options">
            <div className="size">
              <p>Kích thước</p>
              <div className="size-options">
                {["L", "XL", "XS"].map((size) => (
                  <button
                    key={size}
                    className={selectedSize === size ? "active" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="color">
              <p>Màu</p>
              <div className="color-options">
                {["#c98d48", "#000", "#e5e5e5"].map((color) => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }}
                    className={selectedColor === color ? "active" : ""}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="quantity">
              <button onClick={() => handleQuantity("decrease")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantity("increase")}>+</button>
            </div>
            <button className="add-to-cart">Thêm vào giỏ hàng</button>
            <button className="product-buy">Mua Ngay</button>
          </div>

          <div className="details">
            <p>
              <strong>SKU:</strong> SS001
            </p>
            <p>
              <strong>Danh mục:</strong> T-Shirts
            </p>
            <p>
              <strong>Tags:</strong> T-shirts, Shirts
            </p>
            <p className="share">
              <strong>Share:</strong>
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-brands fa-linkedin"></i>
            </p>
          </div>
        </div>
      </div>
      {/* 🔼 --- HẾT PHẦN CHI TIẾT --- 🔼 */}

      <Footer />
    </div>
  );
}

export default ProductDetail;
