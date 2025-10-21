// src/App.jsx

import React from 'react';
// Đảm bảo import đúng BrowserRouter, Routes, Route
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm'; 
import './index.css';
import RegisterForm from './components/RegisterForm';

// Component giả lập trang chủ (để / hoạt động)
const HomePage = () => (
  <>
    <Header />
    <main className="main-content-wrapper home-page-content">
      <h1 style={{ textAlign: 'center', padding: '100px', flexGrow: 1 }}>
        Đây là Trang Chủ (Chưa có nội dung)
      </h1>
    </main>
    <Footer />
  </>
);

function App() {
  return (
    // Sử dụng Router (vì đã alias BrowserRouter as Router)
    <Router> 
      <div className="app-layout">
        <Routes>
          {/* 1. Tuyến đường trang chủ */}
          <Route path="/" element={<HomePage />} />
          
          {/* 2. Tuyến đường đăng nhập */}
          <Route path="/login" element={
            <>
              <Header />
              <main><LoginForm /></main>
              <Footer />
            </>
          } />
          
          {/* 3. Tuyến đường đăng ký */}
          <Route path="/register" element={
            <>
              <Header />
              <main><RegisterForm/></main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // RẤT QUAN TRỌNG