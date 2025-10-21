import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; //  import thêm useLocation
import Header from "../Header";
import Banner from "./Banner";
import Footer from "../Footer";
import "./ProductDetail.css";
// import VestNauDetail1 from "./Image/VestNauDetail1.jpg";

// import VestNauDetail2 from "./Image/VestNauDetail2.jpg";
function ProductDetail() {
  const location = useLocation();
  const product = location.state; //  Nhận dữ liệu từ trang trước
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("#c98d48");
  // const [mainImage, setMainImage] = useState(product?.img || "");
  const { name, price, images } = location.state;
  const [mainImg, setMainImg] = useState(images[0]);
  //   const thumbnails = [



  //   // VestNauDetail1,

  //   // VestNauDetail2



  // ];

  // hoặc thêm ảnh phụ nếu có
  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  return (
    <div className="ProductDetail">
      <Header />
      <Banner />
      <div className="product-detail">
        <div className="product-gallery">
          <div className="thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={name}
                onClick={() => setMainImg(img)}
                className={mainImg === img ? "active" : ""}
              />
            ))}
          </div>
          {/* Ảnh Chính */}
          <div className="main-image">
            <img src={mainImg} alt="main product" />
          </div>
        </div>
        {/* Thông tin */}
        <div className="product-info">
          <h2>{name}</h2>
          <p>{price}</p>
          <div className="rating">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <p>5 Customer Review</p>
          </div>
          <p className="product-description">
            Thoải mái, trẻ trung, năng động phù hợp với mọi thời tiết.
          </p>



          <div className="options">

            <div className="size">

              <p>Kích thước</p>

              <div className="size-options">

                {["L", "XL", "XS"].map((size) => (

                  <button
                    key={size}
                    className={selectedSize === size ? "active" : ""}
                    onClick={() => setSelectedSize(size)}
                    >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="color">
              <p>Màu</p>
              <div className="color-options">
                {["#c98d48", "#000", "#e5e5e5"].map((color) => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }}
                    className={selectedColor === color ? "active" : ""}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className="actions">
            <div className="quantity">
              <button onClick={() => handleQuantity("decrease")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantity("increase")}>+</button>
            </div>
            <button className="add-to-cart">Thêm vào giỏ hàng</button>
            <button className="product-buy">Mua Ngay</button>
          </div>


          <div className="details">
            <p><strong>SKU:</strong> SP{product?.id || "000"}</p>
            <p><strong>Danh mục:</strong> Thời trang</p>
            <p><strong>Tags:</strong> {product?.name || ""}</p>
          </div>
        </div>
      </div>



      <Footer />

    </div>

  );

}



export default ProductDetail;