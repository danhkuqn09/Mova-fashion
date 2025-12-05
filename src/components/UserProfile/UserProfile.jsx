import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  // const [statistics, setStatistics] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [statistics, setStatistics] = useState({
    orders: {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    },
    total_spent: 0,
    comments: 0,
  });


  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const resProfile = await axios.get("http://localhost:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Profile API response:", resProfile);
      const resStats = await axios.get("http://localhost:8000/api/profile/statistics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Statistics API response:", resStats);
      setProfile(resProfile.data.data);
      setStatistics(resStats.data.data);
      setEditData({
        id: resProfile.data.data.id,
        name: resProfile.data.data.name,
        email: resProfile.data.data.email,
        phone: resProfile.data.data.phone,
        role: resProfile.data.data.role,
        created_at: resProfile.data.data.created_at
      });
    } catch (err) {
      console.error(err);
      alert("Không thể lấy thông tin user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return alert("Vui lòng chọn ảnh");
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      await axios.post("http://localhost:8000/api/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Cập nhật avatar thành công");
      setAvatarFile(null);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật avatar");
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa avatar?")) return;
    try {
      await axios.delete("http://localhost:8000/api/profile/avatar", {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Xóa avatar thành công");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa avatar");
    }
  };

  const handleSaveProfile = async () => {
    const payload = {
      name: editData.name || "",
      phone: editData.phone || "",
      address: editData.address || "",
    };

    try {
      await axios.post(
        "http://localhost:8000/api/profile/update",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cập nhật thông tin thành công");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Không thể cập nhật thông tin");
    }
  };


  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="profile-container">
      <h1>Thông tin cá nhân</h1>
      <div className="profile-card">
        <div className="avatar-section">
          <img src={profile.avatar ? `http://localhost:8000${profile.avatar}?t=${Date.now()}` : "/Image/default.png"} />

          <input type="file" onChange={handleAvatarChange} />
          <button onClick={handleUploadAvatar}>Cập nhật ảnh</button>
          {profile.avatar && <button onClick={handleDeleteAvatar}>Xóa ảnh</button>}
        </div>


        <div className="info-section">
          {editing ? (
            <>
              <input
                type="text"
                value={editData.name || ""}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Tên"
              />
              <input
                type="text"
                value={editData.phone || ""}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                placeholder="SĐT"
              />
              <input
                type="text"
                value={editData.address || ""}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                placeholder="Địa chỉ"
              />
              <button onClick={handleSaveProfile}>Lưu</button>
              <button onClick={() => setEditing(false)}>Hủy</button>
            </>
          ) : (
            <>
              <p><b>ID: </b>{profile.id}</p>
              <p><b>Tên:</b> {profile.name}</p>
              <p><b>Email:</b> {profile.email}</p>
              <p><b>SĐT:</b> {profile.phone}</p>
              <p><b>Role: </b>{profile.role}</p>
              <p><b>Ngày tạo: </b>{profile.created_at}</p>
              <button onClick={() => setEditing(true)}>Chỉnh sửa</button>
            </>
          )}
        </div>

      </div>

      <div className="stats-card">
        <p><b>Tổng đơn:</b> {statistics.orders?.total || 0}</p>
        <p><b>Chưa xử lý: </b>{statistics.orders?.pending || 0}</p>
        <p><b>Đã xử lý: </b>{statistics.orders?.processing || 0}</p>
        <p><b>Đã hoàn thành:</b> {statistics.orders?.completed || 0}</p>
        <p><b>Đã hủy:</b> {statistics.orders?.cancelled || 0}</p>
        <p><b>Tổng chi tiêu:</b> {statistics.total_spent?.toLocaleString() || 0}₫</p>

      </div>
      <div className="stats-comment">
        <h2>Thống kê bình luận</h2>
        <p><b>Số lần bình luận: </b>{statistics.comments}</p>
      </div>
    </div>
  );
};

export default UserProfile;
