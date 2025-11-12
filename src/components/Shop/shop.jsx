import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "./Banner";
import "./shop.css";
import { Link } from "react-router-dom";

function Shop() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resCategories, resFeatured, resNewArrivals, resOnSale] =
          await Promise.all([
            axios.get("http://localhost:8000/api/categories"),
            axios.get("http://localhost:8000/api/products/featured"),
            axios.get("http://localhost:8000/api/products/new-arrivals"),
            axios.get("http://localhost:8000/api/products/on-sale"),
          ]);

        const getData = (res) => {
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.data.data)) return res.data.data;
          if (Array.isArray(res.data.data?.products?.data))
            return res.data.data.products.data;
          return [];
        };

        setCategories(getData(resCategories));
        setFeatured(getData(resFeatured));
        setNewArrivals(getData(resNewArrivals));
        setOnSale(getData(resOnSale));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/products/category/${categoryId}`
      );
      const getData = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.data)) return res.data.data;
        if (Array.isArray(res.data.data?.products?.data))
          return res.data.data.products.data;
        return [];
      };
      setProducts(getData(res));
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm theo danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌀 Loading spinner giống các trang khác
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const renderProducts = (list) =>
    list.map((p) => (
      <div className="product-card" key={p.id}>
        <img
          src={
            p.image
              ? `http://localhost:8000/storage/${p.image}`
              : "/Image/no-image.png"
          }
          alt={p.name}
        />
        <h3>{p.name}</h3>
        <p>{p.price}₫</p>
        <Link to={`/productdetail/${p.id}`} className="buy-btn">
          <button>Mua Ngay</button>
        </Link>
      </div>
    ));

  const renderCategories = () =>
    categories.map((c) => (
      <button
        key={c.id}
        onClick={() => handleCategoryClick(c.id)}
        className={`category-btn ${selectedCategory === c.id ? "active" : ""}`}
      >
        {c.name}
      </button>
    ));

  return (
    <div className="shop">
      <Banner />

      <section className="categories">
        <h2>Danh mục sản phẩm</h2>
        <div className="category-list">{renderCategories()}</div>
      </section>

      {selectedCategory ? (
        <section className="products">
          <h2>Sản phẩm theo danh mục</h2>
          <div className="shop-grid">{renderProducts(products)}</div>
        </section>
      ) : (
        <>
          <section className="products">
            <h2>Sản phẩm nổi bật</h2>
            <div className="product-grid">{renderProducts(featured)}</div>
          </section>

          <section className="products">
            <h2>Hàng mới về</h2>
            <div className="product-grid">{renderProducts(newArrivals)}</div>
          </section>

          <section className="products">
            <h2>Đang giảm giá</h2>
            <div className="product-grid">{renderProducts(onSale)}</div>
          </section>
        </>
      )}

      
    </div>
  );
}

export default Shop;
