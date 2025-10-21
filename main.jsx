import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // PHẢI import App đúng
import './index.css'; // Import CSS chung
// import './App.css'; // Nếu Vite tạo file này, hãy giữ lại

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* PHẢI render component App */}
  </React.StrictMode>,
);