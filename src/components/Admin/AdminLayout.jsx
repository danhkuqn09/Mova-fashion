import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();
  
  useEffect(() => {
    // Map route sang title tương ứng
    const titles = {
      '/admin': 'Dashboard - Admin MOVA Clothes',
      '/admin/users': 'Quản lý người dùng - Admin MOVA',
      '/admin/products': 'Quản lý sản phẩm - Admin MOVA',
      '/admin/products/add': 'Thêm sản phẩm - Admin MOVA',
      '/admin/categories': 'Quản lý danh mục - Admin MOVA',
      '/admin/categories/add': 'Thêm danh mục - Admin MOVA',
      '/admin/orders': 'Quản lý đơn hàng - Admin MOVA',
      '/admin/comments': 'Quản lý bình luận - Admin MOVA',
      '/admin/voucher': 'Quản lý voucher - Admin MOVA',
      '/admin/voucher/add': 'Thêm voucher - Admin MOVA',
      '/admin/news': 'Quản lý tin tức - Admin MOVA',
      '/admin/reviews': 'Quản lý đánh giá - Admin MOVA',
    };
    
    // Xử lý dynamic routes (có :id)
    let pageTitle = titles[location.pathname];
    
    if (!pageTitle) {
      if (location.pathname.includes('/admin/products/edit/')) {
        pageTitle = 'Sửa sản phẩm - Admin MOVA';
      } else if (location.pathname.includes('/admin/categories/edit/')) {
        pageTitle = 'Sửa danh mục - Admin MOVA';
      } else if (location.pathname.includes('/admin/orders/')) {
        pageTitle = 'Chi tiết đơn hàng - Admin MOVA';
      } else if (location.pathname.includes('/admin/users/')) {
        pageTitle = 'Chi tiết người dùng - Admin MOVA';
      } else if (location.pathname.includes('/admin/comments/')) {
        pageTitle = 'Chi tiết bình luận - Admin MOVA';
      } else if (location.pathname.includes('/admin/reviews/')) {
        pageTitle = 'Chi tiết đánh giá - Admin MOVA';
      } else if (location.pathname.includes('/admin/news/')) {
        pageTitle = 'Chi tiết tin tức - Admin MOVA';
      } else {
        pageTitle = 'Admin - MOVA Clothes';
      }
    }
    
    // Đổi title
    document.title = pageTitle;
    
    // Đổi favicon (nếu bạn có logo admin riêng)
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = '/Image/LogoHome.png'; // Hoặc '/Image/LogoAdmin.png' nếu có
    }
    
    // Cleanup: Trả lại title và favicon gốc khi rời khỏi admin
    return () => {
      document.title = 'MOVA Clothes - Thời trang nam cao cấp';
      if (favicon) {
        favicon.href = '/Image/LogoHome.png';
      }
    };
  }, [location.pathname]);
  
  return <Outlet />;
}

export default AdminLayout;
