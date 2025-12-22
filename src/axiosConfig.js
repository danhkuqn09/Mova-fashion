import axios from 'axios';

// Setup axios interceptor để xử lý lỗi 401 (Unauthorized)

axios.interceptors.response.use(
    (response) => {
        // Trả về response bình thường nếu thành công
        return response;
    },
    (error) => {
        // Kiểm tra nếu lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
        if (error.response && error.response.status === 401) {
            // Kiểm tra nếu đang ở trang admin
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            
            if (isAdminRoute) {
                // Lưu URL hiện tại để redirect lại sau khi đăng nhập
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                
                // Xóa token
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Hiển thị thông báo
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                
                // Chuyển hướng về trang login
                window.location.href = '/login';
            }
        }
        
        // Trả về lỗi để các catch block khác vẫn xử lý được
        return Promise.reject(error);
    }
);

export default axios;
