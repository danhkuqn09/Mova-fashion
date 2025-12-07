import React, { useState, useEffect } from "react";
import "./Product.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/products");

        const productData = Array.isArray(res.data.data?.products)
          ? res.data.data.products
          : [];

        setProducts(productData);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  const showMore = () => setVisibleCount((prev) => prev + 10);

  // 👉 Hàm giống ProductDetail.jsx
  const handleBuyNow = (p) => {
    const price = p.price_after_discount ?? p.price;

    navigate("/checkout", {
      state: {
        buyNow: true,
        item: {
          product_variant_id: p.id,  // hoặc p.variant_id nếu có biến thể
          quantity: 1,
          price: price,
          name: p.name,
        },
        subtotal: price,
      },
    });
  };


  return (
    <section className="products">
      <h2>Sản phẩm của chúng tôi</h2>

      <div className="product-grid">
        {products.slice(0, visibleCount).map((p) => (
          <div className="product-card" key={p.id}>
            <Link to={`/productdetail/${p.id}`}>
              <img
                src={`http://localhost:8000${p.image}`}
                alt={p.name}
              />
            </Link>
            <h3>{p.name}</h3>
            {p.price_after_discount ? (
              <p>
                <span className="price-discount">
                  {p.price_after_discount.toLocaleString()}đ
                </span>
                <span className="price-original">
                  {p.price.toLocaleString()}đ
                </span>
              </p>
            ) : (
              <p>{p.price.toLocaleString()}đ</p>
            )}
            <button className="buy-btn" onClick={() => handleBuyNow(p)}>
              Mua Ngay
            </button>
          </div>
        ))}
      </div>

      {visibleCount < products.length && (
        <div className="show-more-container">
          <button className="show-more-btn" onClick={showMore}>
            Hiển thị thêm
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductSection;
