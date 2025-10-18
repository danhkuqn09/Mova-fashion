import React, { useState } from "react";
import "./Product.css";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Vest Nữ", price: "530.000 VNĐ", img: "/Image/vestNuNau.jpg" },
  { id: 2, name: "Áo Khoác Da", price: "420.000 VNĐ", img: "/Image/aoKhoacDaNu.jpg" },
  { id: 3, name: "Áo Sơ Mi Phối Nơ", price: "250.000 VNĐ", img: "/Image/aoSoMiNu.webp" },
  { id: 4, name: "Quần Jeans Ống Suông", price: "690.000 VNĐ", img: "/Image/quanJeansNu.webp" },
  { id: 5, name: "Áo Thun Nam", price: "550.000 VNĐ", img: "/Image/aoThunNam.jpg" },
  { id: 6, name: "Áo Sơ Mi", price: "320.000 VNĐ", img: "/Image/aoSoMiNam.jpg" },
  { id: 7, name: "Áo Khoác", price: "590.000 VNĐ", img: "/Image/aoKhoacNam.jpg" },
  { id: 8, name: "Quần jeans", price: "460.000 VNĐ", img: "/Image/quanJeansNam.jpg" },
  { id: 9, name: "Vest Nữ", price: "530.000 VNĐ", img: "/Image/vestNuNau.jpg" },
  { id: 10, name: "Áo Khoác Da", price: "420.000 VNĐ", img: "/Image/aoKhoacDaNu.jpg" },
  { id: 11, name: "Áo Sơ Mi Phối Nơ", price: "250.000 VNĐ", img: "/Image/aoSoMiNu.webp" },
  { id: 12, name: "Quần Jeans Ống Suông", price: "690.000 VNĐ", img: "/Image/quanJeansNu.webp" },
  { id: 13, name: "Áo Thun Nam", price: "550.000 VNĐ", img: "/Image/aoThunNam.jpg" },
  { id: 14, name: "Áo Sơ Mi", price: "320.000 VNĐ", img: "/Image/aoSoMiNam.jpg" },
  { id: 15, name: "Áo Khoác", price: "590.000 VNĐ", img: "/Image/aoKhoacNam.jpg" },
  { id: 16, name: "Quần jeans", price: "460.000 VNĐ", img: "/Image/quanJeansNam.jpg" },
  { id: 17, name: "Vest Nữ", price: "530.000 VNĐ", img: "/Image/vestNuNau.jpg" },
  { id: 18, name: "Áo Khoác Da", price: "420.000 VNĐ", img: "/Image/aoKhoacDaNu.jpg" },
  { id: 19, name: "Áo Sơ Mi Phối Nơ", price: "250.000 VNĐ", img: "/Image/aoSoMiNu.webp" },
  { id: 20, name: "Quần Jeans Ống Suông", price: "690.000 VNĐ", img: "/Image/quanJeansNu.webp" },
  { id: 21, name: "Áo Thun Nam", price: "550.000 VNĐ", img: "/Image/aoThunNam.jpg" },
  { id: 22, name: "Áo Sơ Mi", price: "320.000 VNĐ", img: "/Image/aoSoMiNam.jpg" },
  { id: 23, name: "Áo Khoác", price: "590.000 VNĐ", img: "/Image/aoKhoacNam.jpg" },
  { id: 24, name: "Quần jeans", price: "460.000 VNĐ", img: "/Image/quanJeansNam.jpg" },
];

function ProductSection() {
  const [visibleCount, setVisibleCount] = useState(8); // số sản phẩm hiển thị lúc đâầu là 8

  const showMore = () => {
    setVisibleCount(prev => prev + 8); // mỗi lần bấm hiển thị thêm 8 sản phẩm
  };

  return (
    <section className="products">
      <h2>Sản phẩm của chúng tôi</h2>
      <div className="product-grid">
        {products.slice(0, visibleCount).map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price}</p>
           <Link to="/productdetail" className="buy-btn"><button>Mua Ngay</button></Link>

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
