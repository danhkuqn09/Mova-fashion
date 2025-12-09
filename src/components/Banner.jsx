import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <section className="banner py-5">
      <div className="container">
        {/* Hero Banner */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="position-relative overflow-hidden rounded-4 shadow-lg">
              <img 
                src="/public/Image/BannerHome.png" 
                alt="Model 1" 
                className="w-100 img-fluid"
                style={{ maxHeight: '600px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                <h1 className="display-4 fw-bold mb-3 text-shadow">MOVACLOTHES</h1>
                <p className="lead text-shadow">Phong cách - Đẳng cấp - Sang trọng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Phù Hợp Mọi Hoàn Cảnh</h2>
          <p className="lead text-muted">Thanh lịch, đẳng cấp & tinh tế</p>
        </div>

        {/* Categories */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 category-card">
              <img src="/Image/congSo.png" alt="Công sở" className="card-img-top rounded-3" style={{ height: '400px', objectFit: 'cover' }} />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Công Sở</h5>
                <p className="text-muted">Lịch sự & Chuyên nghiệp</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 category-card">
              <img src="/Image/duTiec.png" alt="Dự tiệc" className="card-img-top rounded-3" style={{ height: '400px', objectFit: 'cover' }} />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Dự Tiệc</h5>
                <p className="text-muted">Sang trọng & Quyến rũ</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 category-card">
              <img src="/Image/doNgu.png" alt="Đồ ngủ" className="card-img-top rounded-3" style={{ height: '400px', objectFit: 'cover' }} />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Đồ Ngủ</h5>
                <p className="text-muted">Thoải mái & Thư giãn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
