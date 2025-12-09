// src/components/About.jsx
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <h1>Về Trang web của Chúng tôi</h1>
      
      <section className="about-intro">
        <p>
          Chào mừng bạn đến với [Tên Trang web Của Bạn]! Chúng tôi được thành lập với sứ mệnh [Mục tiêu Chính] 
          và trở thành một nguồn thông tin/dịch vụ đáng tin cậy cho [Đối tượng Mục tiêu].
        </p>
      </section>

      <section className="about-mission">
        <h2>Sứ mệnh của Chúng tôi 🎯</h2>
        <p>
          Sứ mệnh của chúng tôi là cung cấp [Giá trị Cốt lõi, ví dụ: sản phẩm chất lượng cao, thông tin chính xác, dịch vụ khách hàng tuyệt vời]
          và góp phần xây dựng một cộng đồng [Đặc điểm cộng đồng, ví dụ: mua sắm thông minh, yêu thích công nghệ].
        </p>
      </section>

      <section className="about-team">
        <h2>Đội ngũ sáng lập ✨</h2>
        <div className="team-member">
          <h3>Phạm Minh Quân</h3>
          <p>Vai trò: CEO & Sáng lập viên</p>
          <p>Sở thích: Lập trình ReactJS và làm vườn.</p>
        </div>
        <div className="team-member">
          <h3>Nguyễn Thành Danh</h3>
          <p>Vai trò: Trưởng phòng Phát triển Nội dung</p>
          <p>Sở thích: Nghiên cứu thị trường và đọc sách.</p>
        </div>
        <div className="team-member">
          <h3>Trần Gia Huy</h3>
          <p>Vai trò: Nhân Viên làm công ăn lương</p>
          <p>Sở thích: Nghe nhạc và tìm tòi những thứ mới lạ.</p>
        </div>
      </section>

      <section className="about-values">
        <h2>Giá trị Cốt lõi</h2>
        <ul>
          <li>**Chất lượng:** Luôn đặt chất lượng sản phẩm/dịch vụ lên hàng đầu.</li>
          <li>**Minh bạch:** Cung cấp thông tin rõ ràng và trung thực.</li>
          <li>**Sáng tạo:** Không ngừng đổi mới và cải tiến.</li>
        </ul>
      </section>
    </div>
  );
};

export default About;