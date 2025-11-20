import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Banner from "./Banner";
import { useNavigate } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        const data =
          res.data?.data?.product ||
          res.data?.data ||
          res.data.product ||
          res.data;

        setProduct(data);
        setMainImg(`http://localhost:8000${data.image}`);
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

  //Tìm variant đang chọn
  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.size === selectedSize && v.color_id === selectedColor.id
    );
  }, [product, selectedColor, selectedSize]);

  //Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và size trước khi thêm vào giỏ!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/cart",
        {
          product_variant_id: selectedVariant.id,
          quantity: quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        alert(" Đã thêm sản phẩm vào giỏ hàng!");
      } else {
        alert("❌ " + (res.data?.message || "Không thể thêm sản phẩm!"));
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data || error);
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        window.location.href = "/login";
      } else {
        alert(" Thêm sản phẩm thất bại!");
      }
    }
  };
  const handleBuyNow = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và size trước khi mua!");
      return;
    }

    const buyItem = {
      product_variant_id: selectedVariant.id,
      name: product.name,
      product: product,
      quantity: quantity,
      price: selectedVariant.sale_price || selectedVariant.price || product.price,
    };

    navigate("/checkout", {
      state: {
        buyNow: true,
        item: buyItem,
        subtotal: buyItem.price * quantity,
      },
    });
  };

  // 🔹 Hiển thị khi đang tải (giống CartPage)
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) return <p>Không tìm thấy sản phẩm.</p>;

  return (
    <div className="ProductDetail">
      <Banner />

      <div className="product-detail">
        <div className="product-gallery">
          <div className="thumbnails">
            {[product.image, ...product.variants.map((v) => v.image)]
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
            <img src={mainImg || "/storage/default.jpg"} alt="main product" />
          </div>
        </div>

        {/* ================= Thông tin sản phẩm ================= */}
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">
            {formatVND(product.sale_price || product.price)}
          </p>

          <div className="rating">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <p>5 Customer Review</p>
          </div>

          <p className="product-description">{product.description}</p>

          {/* ================= Chọn màu & size ================= */}
          <div className="options">
            <div className="color">
              <p>Màu sắc</p>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    style={{ backgroundColor: color.color_code }}
                    className={selectedColor?.id === color.id ? "active" : ""}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>

            <div className="size">
              <p>Kích thước</p>
              <div className="size-options">
                {[...new Set(product.variants.map((v) => v.size))].map(
                  (size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "active" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ================= Nút hành động ================= */}
          <div className="actions">
            <div className="quantity">
              <button onClick={() => handleQuantity("decrease")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantity("increase")}>+</button>
            </div>

            <button className="add-to-cart" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
            <button className="product-buy" onClick={handleBuyNow}>
              Mua Ngay
            </button>

          </div>

          {/* ================= Chi tiết thêm ================= */}
          <div className="details">
            <p>
              <strong>SKU:</strong> SP{product.id}
            </p>
            <p>
              <strong>Danh mục:</strong>{" "}
              {product.category?.name || "Không rõ"}
            </p>
            <p>
              <strong>Tags:</strong> {product.tag || ""}
            </p>
          </div>
        </div>
      </div>


    </div>
  );
}

export default ProductDetail;
