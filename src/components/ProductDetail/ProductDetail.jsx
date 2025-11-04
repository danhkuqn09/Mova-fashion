import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "./Banner";
import Footer from "../Footer";
import "./ProductDetail.css";

function ProductDetail() {
  const location = useLocation();
  const product = location.state;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("#c98d48");
  const { name, price, images } = location.state;
  const [mainImg, setMainImg] = useState(images[0]);

  // 👉 Làm sạch giá để luôn ra dạng số (kể cả khi có dấu . hoặc ₫)
  const cleanPrice = Number(String(price).replace(/[^\d]/g, "")) || 0;
  const totalPrice = cleanPrice * quantity;

  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  // 👉 Hàm định dạng tiền VND
  const formatVND = (value) => value.toLocaleString("vi-VN") + "₫";

  // ✅ Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: cleanPrice,
      image: mainImg,
      quantity,
      size: selectedSize,
      color: selectedColor,
    };

    // Lấy giỏ hàng hiện có từ localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Nếu sản phẩm cùng id, size, màu → cộng thêm số lượng
    const existingIndex = existingCart.findIndex(
      (item) =>
        item.id === productToAdd.id &&
        item.size === productToAdd.size &&
        item.color === productToAdd.color
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(productToAdd);
    }

    // Lưu lại
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Thông báo nhẹ
    alert(" Đã thêm sản phẩm vào giỏ hàng!");
  };

  return (
    <div className="ProductDetail">
      <Banner />
      <div className="product-detail">
        <div className="product-gallery">
          <div className="thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={name}
                onClick={() => setMainImg(img)}
                className={mainImg === img ? "active" : ""}
              />
            ))}
          </div>

          <div className="main-image">
            <img src={mainImg} alt="main product" />
          </div>
        </div>

        <div className="product-info">
          <h2>{name}</h2>

          {/* 👉 Hiển thị tổng giá */}
          <p className="price">{formatVND(totalPrice)}</p>

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
            {/* ✅ Gắn sự kiện thêm vào giỏ hàng */}
            <button className="add-to-cart" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
            <button className="product-buy">Mua Ngay</button>
          </div>

          <div className="details">
            <p><strong>SKU:</strong> SP{product?.id || "000"}</p>
            <p><strong>Danh mục:</strong> Thời trang</p>
            <p><strong>Tags:</strong> {product?.name || ""}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
