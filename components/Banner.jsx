import React from "react";
import "./Banner.css";

// 1. Import các thành phần và modules cần thiết của Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'; 

// 2. Import CSS cần thiết của Swiper (Quan trọng!)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade'; // CSS cho hiệu ứng Fade

function Banner() {
  // Danh sách các ảnh banner (Bạn cần đảm bảo các đường dẫn ảnh này tồn tại)
  const bannerImages = [
    { src: "/public/Image/BannerHome.png", alt: "Model 1" },
    { src: "/public/Image/Banner2.jpg", alt: "Model 2" },
    { src: "/public/Image/banner3.jpg", alt: "Model 3" },
  ];

  return (
    <section className="banner">
      {/* -------------------- SLIDER BANNER (SWIPER) -------------------- */}
      <Swiper
        // Modules: Chức năng tự động, phân trang, điều hướng, hiệu ứng
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        
        // Cấu hình Hiệu ứng Fade
        effect="fade" 
        fadeEffect={{
          crossFade: true, 
        }}


        spaceBetween={0} 
        slidesPerView={1} 
        loop={true} 
        

        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        

        pagination={{ clickable: true }}
        navigation={true}               

        className="top-images-slider" 
      >
        {/* Tạo các Slide */}
        {bannerImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image.src} 
              alt={image.alt} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* -------------------- HẾT SLIDER BANNER -------------------- */}
      
      <div className="banner-text">
        <h2>Phù Hợp Mọi Hoàn Cảnh</h2>
        <p>Thanh lịch, đẳng cấp & tinh tế</p>
      </div>

      <div className="image-categories">
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