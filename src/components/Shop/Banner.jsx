import React from "react";
import { Link } from "react-router-dom";
import "./Banner-shop.css";

function Banner() {
  return (
    <section className="banner-shop">
      <div className="top-images-shop">
        <img src="/Image/bannerShop.jpg" alt="Banner cửa hàng" className="banner-image" />
      </div>
      <div className="banner-content">
        <h1 className="shop-title">Cửa Hàng</h1>
        <p className="shop-path">
          <Link to="/" className="breadcrumb-link">Trang Chủ</Link>
          <span> &gt; </span>
          <span className="breadcrumb-current">Cửa Hàng</span>
        </p>
      </div>
    </section>
  );
}

export default Banner;
