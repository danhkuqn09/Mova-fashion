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


  // Format tiền VNĐ
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="spinner-border" role="status" style={{ color: '#b88e2f' }}>
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center" style={{ color: '#b88e2f' }}>Thông tin cá nhân</h2>
      
      <div className="row">
        {/* Avatar Section */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <img 
                src={profile.avatar ? `http://localhost:8000${profile.avatar}?t=${Date.now()}` : "/Image/default.png"} 
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <div className="mb-3">
                <input 
                  type="file" 
                  className="form-control form-control-sm" 
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </div>
              <button 
                className="btn btn-sm w-100 mb-2" 
                style={{ backgroundColor: '#b88e2f', color: 'white', border: 'none' }}
                onClick={handleUploadAvatar}
              >
                <i className="fas fa-upload me-2"></i>Cập nhật ảnh
              </button>
              {profile.avatar && (
                <button 
                  className="btn btn-danger btn-sm w-100" 
                  onClick={handleDeleteAvatar}
                >
                  <i className="fas fa-trash me-2"></i>Xóa ảnh
                </button>
              )}
            </div>
          </div>

          {/* Statistics Card */}
          <div className="card shadow-sm mt-4">
            <div className="card-header text-white" style={{ backgroundColor: '#b88e2f' }}>
              <h5 className="mb-0"><i className="fas fa-chart-bar me-2"></i>Thống kê</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6 className="text-muted mb-2">Đơn hàng</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tổng đơn:</span>
                  <strong style={{ color: '#b88e2f' }}>{statistics.orders?.total || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Chờ xử lý:</span>
                  <strong className="text-warning">{statistics.orders?.pending || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Đang xử lý:</span>
                  <strong className="text-info">{statistics.orders?.processing || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Hoàn thành:</span>
                  <strong className="text-success">{statistics.orders?.completed || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Đã hủy:</span>
                  <strong className="text-danger">{statistics.orders?.cancelled || 0}</strong>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span>Tổng chi tiêu:</span>
                <strong style={{ color: '#b88e2f' }}>{formatMoney(statistics.total_spent || 0)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span><i className="fas fa-comments me-2"></i>Bình luận:</span>
                <strong>{statistics.comments || 0}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#b88e2f' }}>
              <h5 className="mb-0"><i className="fas fa-user me-2"></i>Thông tin tài khoản</h5>
              {!editing && (
                <button 
                  className="btn btn-light btn-sm" 
                  onClick={() => setEditing(true)}
                >
                  <i className="fas fa-edit me-2"></i>Chỉnh sửa
                </button>
              )}
            </div>
            <div className="card-body">
              {editing ? (
                <form>
                  <div className="mb-3">
                    <label className="form-label"><strong>Họ tên</strong></label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Số điện thoại</strong></label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Địa chỉ</strong></label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.address || ""}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      type="button"
                      className="btn" 
                      style={{ backgroundColor: '#b88e2f', color: 'white', border: 'none' }}
                      onClick={handleSaveProfile}
                    >
                      <i className="fas fa-save me-2"></i>Lưu thay đổi
                    </button>
                    <button 
                      type="button"
                      className="btn btn-secondary" 
                      onClick={() => setEditing(false)}
                    >
                      <i className="fas fa-times me-2"></i>Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">ID</small>
                        <p className="mb-0 fw-bold">{profile.id}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Vai trò</small>
                        <p className="mb-0 fw-bold">
                          <span className={`badge ${profile.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                            {profile.role}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Họ tên</small>
                        <p className="mb-0 fw-bold">{profile.name || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Email</small>
                        <p className="mb-0 fw-bold">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Số điện thoại</small>
                        <p className="mb-0 fw-bold">{profile.phone || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Ngày tạo</small>
                        <p className="mb-0 fw-bold">{new Date(profile.created_at).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="p-3 bg-light rounded">
                        <small className="text-muted">Địa chỉ</small>
                        <p className="mb-0 fw-bold">{profile.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
