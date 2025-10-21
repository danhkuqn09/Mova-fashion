import React, { useState, useEffect } from "react";
import "./Product.css";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, []);

  const showMore = () => setVisibleCount(prev => prev + 8);

  return (
    <section className="products">
      <h2>Sản phẩm của chúng tôi</h2>
      <div className="product-grid">
        {products.slice(0, visibleCount).map((p) => (
          <div className="product-card" key={p.id}>
           <img src={`http://127.0.0.1:8000${p.images[0]}`} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price}</p>
            <Link
              to="/productdetail"
              state={{
               name: p.name,
                price: p.price,
                images: p.images, // truyền cả mảng ảnh
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
