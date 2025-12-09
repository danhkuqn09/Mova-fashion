// src/components/contact/Contact.jsx
import React, { useState } from 'react';
import './Contact.css';
// Import CSS module nếu bạn tạo file Contact.module.css
// import styles from './Contact.module.css'; 

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dữ liệu Form:', formData);
    alert('Tin nhắn của bạn đã được gửi thành công!');
    // Tùy chọn: Xóa form sau khi gửi
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <h1>Liên hệ với chúng tôi</h1>
      <p>Chúng tôi rất vui khi nhận được phản hồi từ bạn!</p>

      {/* Thông tin liên hệ cơ bản */}
      <section className="contact-details">
        <h2>Chi tiết liên hệ</h2>
        <ul>
          <li>📧 **Email Hỗ trợ:** yaquy204@gmail.com</li>
          <li>📞 **Hotline:** (84) 123 456 789</li>
          <li>📍 **Địa chỉ:** Tòa nhà T, 123 Đường Tô Ký, TP.HCM</li>
        </ul>
      </section>

      {/* Form Gửi tin nhắn */}
      <section className="contact-form-section">
        <h2>Gửi tin nhắn</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Tên:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label htmlFor="message">Nội dung:</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5" 
              value={formData.message} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>
          <button type="submit">Gửi tin nhắn</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;