
import Header from "../Header";
import Banner from "./Banner";
import Footer from "../Footer";
import "./shop.css";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";


function Shop() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, []);




  return (

    <div className="shop">
      <Header />
      <Banner />

      <section className="products">
        <h2>Sản phẩm của chúng tôi</h2>
        <div className="product-grid">
          {products.slice(0,).map((p) => (
            <div className="product-card" key={p.id}>
              <img src={`http://127.0.0.1:8000${p.images[0]}`} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <Link
                to="/productdetail"
                state={{
                  name: p.name,
                  price: p.price,
                  images: p.images,
                }}
                className="buy-btn"
              >
                <button>Mua Ngay</button>
              </Link>

            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Shop;
