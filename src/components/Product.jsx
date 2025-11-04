import React, { useState, useEffect } from "react";
import "./Product.css";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products");
      console.log("Dữ liệu từ Laravel:", res.data);

      // Dữ liệu nằm trong res.data.data.data (vì Laravel phân trang)
      const productData = Array.isArray(res.data.data?.data)
        ? res.data.data.data
        : [];

      setProducts(productData);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  fetchProducts();
}, []);


  const showMore = () => setVisibleCount((prev) => prev + 8);

  return (
    <section className="products">
      <h2>Sản phẩm của chúng tôi</h2>
      <div className="product-grid">
        {products.slice(0, visibleCount).map((p) => (
          <div className="product-card" key={p.id}>
            <img
              src={
                p.image
                  ? `http://localhost:8000/storage/${p.image}`
                  : "/Image/default.jpg"
              }
              alt={p.name}
            />
            <h3>{p.name}</h3>
            <p>{p.price ? `${p.price.toLocaleString()}₫` : "Liên hệ"}</p>
            <Link
              to="/productdetail"
              state={{
                name: p.name,
                price: p.price,
                images: [p.image],
              }}
              className="buy-btn"
            >
              <button>Mua Ngay</button>
            </Link>
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
