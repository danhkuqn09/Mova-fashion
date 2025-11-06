# 🚀 Hướng dẫn tích hợp và test PayOS

## ✅ Đã hoàn thành tích hợp

Backend đã được tích hợp PayOS hoàn chỉnh với các tính năng:

- ✅ Tạo payment link với QR code
- ✅ Webhook nhận kết quả thanh toán
- ✅ Return URL xử lý redirect
- ✅ Auto rollback khi thanh toán thất bại
- ✅ Hoàn trả tồn kho & voucher
- ✅ Transaction safety

---

## 📝 Bước 1: Đăng ký tài khoản PayOS (5 phút)

### **1.1. Truy cập và đăng ký**

🔗 https://payos.vn/

1. **Click "Đăng ký ngay"**
2. **Điền thông tin:**
   - Số điện thoại
   - Email
   - Mật khẩu
3. **Xác nhận OTP**
4. **Đăng nhập**

### **1.2. Hoàn thiện thông tin**

Sau khi đăng nhập lần đầu:

1. **Thông tin cá nhân:**
   - Họ tên
   - CMND/CCCD
   - Địa chỉ

2. **Thông tin kinh doanh:**
   - Tên doanh nghiệp/cá nhân
   - Lĩnh vực kinh doanh: Thời trang
   - Website: http://localhost:3000 (tạm thời)

3. **Tài khoản ngân hàng:**
   - Tên ngân hàng
   - Số tài khoản
   - Tên chủ tài khoản

**Lưu ý:** PayOS chấp nhận cá nhân, không bắt buộc giấy phép kinh doanh ngay từ đầu!

---

## 🔑 Bước 2: Lấy API Keys

### **2.1. Vào phần "Cài đặt" → "API Keys"**

1. **Client ID**: Mã định danh merchant
2. **API Key**: Key để authenticate
3. **Checksum Key**: Key để tạo chữ ký

### **2.2. Cập nhật vào file `.env`**

```env
# PayOS Configuration
PAYOS_CLIENT_ID=abc123-def456-ghi789
PAYOS_API_KEY=key_abc123def456ghi789xyz
PAYOS_CHECKSUM_KEY=checksum_abc123def456ghi789xyz
PAYOS_ENDPOINT=https://api-merchant.payos.vn/v2/payment-requests
PAYOS_RETURN_URL=http://localhost:3000/payment/callback
PAYOS_CANCEL_URL=http://localhost:3000/payment/cancel
```

**Thay thế:**
- `abc123-def456-ghi789` → Client ID thật của bạn
- `key_abc123...` → API Key thật
- `checksum_abc123...` → Checksum Key thật

### **2.3. Clear cache Laravel**

```bash
php artisan config:clear
```

---

## 🧪 Bước 3: Test với Postman

### **3.1. Login để lấy token**

```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "1|abc123..."
  }
}
```

Copy token này!

### **3.2. Thêm sản phẩm vào giỏ hàng**

```http
POST http://localhost:8000/api/cart
Authorization: Bearer 1|abc123...
Content-Type: application/json

{
  "product_variant_id": 1,
  "quantity": 2
}
```

### **3.3. Tạo đơn hàng với PayOS**

```http
POST http://localhost:8000/api/orders
Authorization: Bearer 1|abc123...
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "address": "123 ABC Street, District 1, HCMC",
  "payment_method": "payos",
  "note": "Giao giờ hành chính"
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Đặt hàng thành công. Vui lòng thanh toán.",
  "data": {
    "order": {
      "id": 1,
      "status": "pending",
      "final_total": 500000,
      ...
    },
    "payment_url": "https://pay.payos.vn/web/abc123",
    "payment_method": "payos",
    "qr_code_url": "https://api.vietqr.io/image/..."
  }
}
```

---

## 📱 Bước 4: Thanh toán test

### **4.1. Mở payment URL**

Copy `payment_url` từ response và mở trong browser:

```
https://pay.payos.vn/web/abc123
```

### **4.2. Quét QR code**

PayOS hiển thị QR code VietQR:

1. **Mở app ngân hàng** (bất kỳ ngân hàng nào hỗ trợ VietQR)
2. **Chọn "Chuyển khoản QR"** hoặc "Scan QR"
3. **Quét QR code** trên màn hình PayOS
4. **Xác nhận số tiền** (đã điền sẵn)
5. **Nhập mật khẩu** và xác nhận

### **4.3. Hoặc chuyển khoản thủ công**

PayOS hiển thị thông tin:
- **Ngân hàng:** VCB/TCB/...
- **Số tài khoản:** 1234567890
- **Nội dung:** PAYOS abc123
- **Số tiền:** 500,000 VND

→ Chuyển khoản với **đúng nội dung** để PayOS nhận diện!

---

## ✅ Bước 5: Kiểm tra kết quả

### **5.1. Webhook tự động**

Sau khi thanh toán thành công, PayOS gọi webhook:

```
POST http://localhost:8000/api/payos/webhook
```

Backend tự động:
- ✅ Cập nhật order status → `processing`
- ✅ Log vào file `storage/logs/laravel.log`

### **5.2. Return URL**

User được redirect về:

```
http://localhost:3000/payment/callback?code=00&id=...&orderCode=...
```

Frontend gọi API:

```http
GET http://localhost:8000/api/payos/return?code=00&id=...&orderCode=...
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Thanh toán thành công",
  "data": {
    "order_id": 1,
    "status": "processing",
    "amount": 500000
  }
}
```

### **5.3. Check order status**

```http
GET http://localhost:8000/api/orders/1
Authorization: Bearer 1|abc123...
```

Verify:
- ✅ `status`: `processing`
- ✅ `payment_method`: `payos`
- ✅ `transaction_id`: có giá trị

---

## 🧪 Test môi trường Sandbox

### **Tài khoản test PayOS:**

PayOS cung cấp môi trường sandbox với:

1. **Test Bank Account:**
   - Ngân hàng test
   - Số tài khoản test
   - Balance ảo để test

2. **Instant payment:**
   - Thanh toán test được xử lý ngay lập tức
   - Không cần chờ

3. **Webhook test:**
   - Có thể trigger webhook thủ công
   - Test callback mà không cần thanh toán thật

**Xem chi tiết:** https://payos.vn/docs/testing

---

## 🔧 Test với ngrok (Webhook từ internet)

PayOS cần gọi webhook từ internet. Nếu bạn đang dev local:

### **1. Cài đặt ngrok**

```bash
# Download từ https://ngrok.com/
# Hoặc dùng npm
npm install -g ngrok
```

### **2. Expose local server**

```bash
ngrok http 8000
```

Output:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:8000
```

### **3. Cập nhật .env**

```env
PAYOS_RETURN_URL=https://abc123.ngrok.io/api/payos/return
# Không cần update webhook URL, PayOS tự động dùng URL đã config
```

### **4. Cấu hình webhook trên PayOS**

Vào PayOS Dashboard → Settings → Webhook:
- **Webhook URL:** `https://abc123.ngrok.io/api/payos/webhook`

---

## 📊 So sánh payment methods

| Feature | COD | Momo | PayOS |
|---------|-----|------|-------|
| **Đăng ký** | Không cần | Cần GP KD | CMND cá nhân |
| **Thời gian duyệt** | 0 | 3-7 ngày | 1-2 ngày |
| **Test** | Ngay | Cần credentials | Sandbox sẵn |
| **QR Code test** | N/A | Không (sandbox) | ✅ Có (VietQR) |
| **Phí giao dịch** | 0% | 1.8-2% | 1.5% |
| **Phổ biến** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **API** | N/A | Phức tạp | Đơn giản |
| **Support** | N/A | Email | Chat trực tiếp |

---

## 🎯 Workflow hoàn chỉnh

```
1. User chọn sản phẩm → Thêm vào giỏ
2. User checkout → Chọn PayOS
3. Backend tạo payment link
4. User quét QR code → Chuyển khoản
5. PayOS xác nhận → Gọi webhook
6. Backend update order → Status: processing
7. User redirect về website
8. Hiển thị "Thanh toán thành công"
```

---

## 🐛 Troubleshooting

### **Lỗi "Invalid signature"**

✅ Kiểm tra `PAYOS_CHECKSUM_KEY` trong .env
✅ Chạy `php artisan config:clear`

### **Webhook không được gọi**

✅ Dùng ngrok để expose local
✅ Cấu hình webhook URL trên PayOS dashboard
✅ Check firewall

### **QR code không load**

✅ Kiểm tra `PAYOS_CLIENT_ID` và `PAYOS_API_KEY`
✅ Xem log: `storage/logs/laravel.log`

### **Order không update sau thanh toán**

✅ Check webhook logs
✅ Verify `transaction_id` được lưu
✅ Test webhook thủ công

---

## 📞 Hỗ trợ

**PayOS Support:**
- 📧 Email: support@payos.vn
- 💬 Chat: https://payos.vn/ (góc phải màn hình)
- 📖 Docs: https://payos.vn/docs/
- 📱 Hotline: (có trên website)

**Telegram/Discord Community:**
- Tham gia group PayOS để được support nhanh

---

## ✨ Kết luận

**Backend đã sẵn sàng 100%!** 🎉

Chỉ cần:
1. ✅ Đăng ký PayOS (5 phút)
2. ✅ Lấy API keys
3. ✅ Update .env
4. ✅ Test ngay!

**PayOS dễ hơn Momo rất nhiều:**
- Đăng ký nhanh
- Test dễ (QR thật với VietQR)
- API đơn giản
- Support tốt

**Chúc bạn thành công! 🚀**
