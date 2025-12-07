import React from "react";
import { Link } from "react-router-dom";
import "./Banner-productDetail.css";

function BannerDetail() {
  return (
    <section className="banner-product-detail">
      <div className="top-images-product-detail">
        <img src="/Image/bannerShop.jpg" alt="Banner cửa hàng" className="banner-image" />
      </div>
      <div className="banner-content">
        <h1 className="shop-title">Chi Tiết Sản Phẩm</h1>
        <p className="shop-path">
          <Link to="/" className="breadcrumb-link">Trang Chủ</Link>
          <span> &gt; </span>
          <span className="breadcrumb-current">Chi Tiết Sản Phẩm</span>
        </p>
      </div>
    </section>
  );
}

export default BannerDetail;
