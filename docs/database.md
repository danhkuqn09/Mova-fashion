# Database Overview

Tai lieu nay tong hop cac collection chinh cho he thong E-commerce (Laravel) va cac quan he giua chung. Muc tieu la mo ta ro rang luong du lieu cho nguoi dung, san pham, don hang va phan quyen.

## 1. Users
Luu thong tin nguoi dung (admin, customer).

Quan he:
- 1 - N voi Orders
- 1 - N voi Comments

## 2. Roles va Permissions (RBAC)
Dung de kiem soat truy cap theo vai tro.

Quan he:
- Roles ↔ Permissions: N - N
- Users ↔ Roles: N - N

## 3. Products
Luu thong tin san pham.

Quan he:
- N - 1 voi Categories
- 1 - N voi OrderItems (chi tiet don hang)
- 1 - N voi Comments

## 4. Categories
Phan loai san pham.

Quan he:
- 1 - N voi Products

## 5. Orders
Luu thong tin don hang.

Quan he:
- N - 1 voi Users
- 1 - N voi OrderItems

## 6. OrderItems (Order Details)
Chi tiet tung san pham trong don hang. Day la bang trung gian the hien quan he N - N giua Orders va Products.

Quan he:
- N - 1 voi Orders
- N - 1 voi Products

## 7. Comments
Nguoi dung danh gia/binh luan san pham.

Quan he:
- N - 1 voi Users
- N - 1 voi Products

## Tong ket quan he
- Users ↔ Orders: 1 - N
- Orders ↔ Products: N - N (qua OrderItems)
- Products ↔ Categories: N - 1
- Users ↔ Roles: N - N
- Roles ↔ Permissions: N - N
- Users ↔ Comments: 1 - N
- Products ↔ Comments: 1 - N

## Repository
Tham khao source code:
https://github.com/danhkuqn09/ecommerce-backend-laravel