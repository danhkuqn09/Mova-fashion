import React from "react";
import { Link } from "react-router-dom";
import "./BannerCart.css";

function BannerCart() {
  return (
    <section className="banner-cart">
      <div className="top-images-cart">
        <img src="/Image/bannerShop.jpg" alt="Banner cửa hàng" className="banner-image" />
      </div>
      <div className="banner-content">
        <h1 className="shop-title">Giỏ Hàng</h1>
        <p className="shop-path">
          <Link to="/" className="breadcrumb-link">Trang Chủ</Link>
          <span> &gt; </span>
          <span className="breadcrumb-current">Giỏ Hàng</span>
        </p>
      </div>
    </section>
  );
}

export default BannerCart;
