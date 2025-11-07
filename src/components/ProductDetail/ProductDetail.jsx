import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Banner from "./Banner";
import Footer from "../Footer";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams(); // 👈 Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("#c98d48");
  const [mainImg, setMainImg] = useState("");

  // 🧩 Gọi API chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        const data =
          res.data?.data ||
          res.data?.product ||
          res.data ||
          {}; // tuỳ cấu trúc API backend
        setProduct(res.data.data.product);
        setMainImg(`http://localhost:8000/storage/${data.image}`);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  const formatVND = (value) =>
    Number(value || 0).toLocaleString("vi-VN") + "₫";

  const handleAddToCart = () => {
    if (!product) return;

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImg,
      quantity,
      size: selectedSize,
      color: selectedColor,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
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

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  if (loading) return <p className="loading">Đang tải chi tiết sản phẩm...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className="ProductDetail">
      <Banner />

      <div className="product-detail">
        <div className="product-gallery">
          <div className="thumbnails">
            {[product.image, product.image2, product.image3]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:8000/storage/${img}`}
                  alt={product.name}
                  onClick={() =>
                    setMainImg(`http://localhost:8000/storage/${img}`)
                  }
                  className={
                    mainImg === `http://localhost:8000/storage/${img}`
                      ? "active"
                      : ""
                  }
                />
              ))}
          </div>

          <div className="main-image">
            <img src={mainImg} alt="main product" />
          </div>
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">{formatVND(product.price * quantity)}</p>

          <div className="rating">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <p>5 Customer Review</p>
          </div>

          <p className="product-description">{product.description}</p>

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

            <button className="add-to-cart" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
            <button className="product-buy">Mua Ngay</button>
          </div>

          <div className="details">
            <p>
              <strong>SKU:</strong> SP{product?.id || "000"}
            </p>
            <p>
              <strong>Danh mục:</strong> {product?.category?.name || "Thời trang"}
            </p>
            <p>
              <strong>Tags:</strong> {product?.name || ""}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
