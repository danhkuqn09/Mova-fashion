import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <section className="banner">
      <div className="top-images">
        <img src="/public/Image/BannerHome.png" alt="Model 1" />
        
      </div>

      <div className="banner-text">
        <h2>Phù Hợp Mọi Hoàn Cảnh</h2>
        <p>Thanh lịch, đẳng cấp & tinh tế</p>
      </div>

      <div className="categories">
        <div>
          <img src="/Image/congSo.png" alt="Công sở" />
          <p>Công Sở</p>
        </div>
        <div>
          <img src="/Image/duTiec.png" alt="Dự tiệc" />
          <p>Dự Tiệc</p>
        </div>
        <div>
          <img src="/Image/doNgu.png" alt="Đồ ngủ" />
          <p>Đồ Ngủ</p>
        </div>
      </div>
    </section>
  );
}

export default Banner;
