import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "./Banner";
import Footer from "../Footer";
import "./shop.css";
import { Link } from "react-router-dom";

function Shop() {
  const [products, setProducts] = useState([]); // ✅ lưu sản phẩm từ API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/products");
        console.log("Dữ liệu từ Laravel:", res.data);

        // ✅ Lấy mảng sản phẩm từ phân trang Laravel
        const productData = Array.isArray(res.data.data?.data)
          ? res.data.data.data
          : [];

        setProducts(productData);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="loading">Đang tải sản phẩm...</p>;

  return (
    <div className="shop">
      <Banner />

      <section className="products">
        <h2>Sản phẩm của chúng tôi</h2>
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <img
                src={p.image ? `http://localhost:8000/storage/${p.image}` : "/Image/no-image.png"}
                alt={p.name}
              />
              <h3>{p.name}</h3>
              <p>{p.price}₫</p>
              <Link
                to="/productdetail"
                state={{
                  name: p.name,
                  price: p.price,
                  images: [p.image ? `http://localhost:8000/storage/${p.image}` : "/Image/no-image.png"],
                }}
                className="buy-btn"
              >
                <button>Mua Ngay</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Shop;
