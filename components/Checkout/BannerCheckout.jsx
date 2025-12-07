import React from "react";
import { Link } from "react-router-dom";
import "./BannerCheckout.css";

function Banner() {
  return (
    <section className="banner-checkout">
      <div className="top-images-checkout">
        <img src="/Image/bannerShop.jpg" alt="Banner cửa hàng" className="banner-image" />
      </div>
      <div className="banner-content-checkout">
        <h1 className="shop-title-checkout">Thanh Toán</h1>
        <p className="shop-path-checkout">
          <Link to="/" className="breadcrumb-link">Giỏ Hàng</Link>
          <span> &gt; </span>
          <span className="breadcrumb-current">Thanh Toán</span>
        </p>
      </div>
    </section>
  );
}

export default Banner;
