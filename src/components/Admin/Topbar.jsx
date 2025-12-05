import React, { useEffect, useState } from "react";
import axios from "axios";

const Topbar = () => {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("📌 Profile Response:", res.data); 

        const user = res.data.data;
        console.log("📌 Avatar:", user.avatar); // LOG  AVATAR

        setAvatar(user.avatar || null);
      })
      .catch((err) => {
        console.log("❌ Lỗi lấy avatar:", err);
      });
  }, []);

  return (
    <header className="topbar">
      <h2>Trang Quản Trị</h2>

      <div className="admin-profile">
        <img
          src={
            avatar
              ? `http://localhost:8000${avatar}`
              : "https://i.pravatar.cc/40"
          }
          alt="avatar"
        />
      </div>
    </header>
  );
};

export default Topbar;
