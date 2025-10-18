import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Product from "./components/Product";
import Footer from "./components/Footer";
import Shop from "./components/Shop/shop";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";



function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <Banner />
            <Product />
            <Footer />
          </>
        }
      />
      <Route path="/shop" element={<Shop />} />
      <Route path="/productdetail" element={<ProductDetail />} />
    </Routes>
  );
}

export default App;
