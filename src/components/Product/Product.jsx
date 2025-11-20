import React, { useState, useEffect } from "react";
import "./Product.css";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/products");
        console.log("Dữ liệu từ Laravel:", res.data);

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

  return (
    <section className="products">
      <h2>Sản phẩm của chúng tôi</h2>
      <div className="product-grid">
        {products.slice(0, visibleCount).map((p) => (
          <div className="product-card" key={p.id}>
            <img
              src={`http://localhost:8000${p.image}`}
              alt={p.name}
            />
            <h3>{p.name}</h3>
            <p>{p.price}đ</p>
            <Link to={`/productdetail/${p.id}`} className="buy-btn">
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
