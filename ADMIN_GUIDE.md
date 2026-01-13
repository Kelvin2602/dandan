# 🔐 Hướng dẫn Quản trị Hệ thống (Admin Guide)
## Cổng thông tin Hội Từ thiện Tây An (Xi'an Charity Association Portal)

---

## 📋 Mục lục
1. [Thông tin Đăng nhập](#thông-tin-đăng-nhập)
2. [Kiến trúc Hệ thống](#kiến-trúc-hệ-thống)
3. [Quản lý Dữ liệu (Database)](#quản-lý-dữ-liệu-database)
4. [Các Module Chức năng](#các-module-chức-năng)
5. [Cấu hình Website (Site Config)](#cấu-hình-website-site-config)
6. [Xử lý sự cố (Troubleshooting)](#xử-lý-sự-cố-troubleshooting)

---

## 🔑 Thông tin Đăng nhập

### **Truy cập:**
- **Địa chỉ:** `/#/admin/login`
- **Demo Account:**
  - Username: `admin`
  - Password: `123456`

> **Lưu ý:** Hiện tại hệ thống sử dụng cơ chế "Demo Token" để xác thực Admin. Trong môi trường Production, cần tích hợp module Authentication JWT đầy đủ.

---

## 🏗️ Kiến trúc Hệ thống

### **Công nghệ Lõi:**
- **Frontend:** React 18, TypeScript, TailwindCSS.
- **Backend/Database:** Serverless PostgreSQL (**NeonDB**).
- **Driver:** `@neondatabase/serverless` (Kết nối trực tiếp từ Frontend -> DB).

### **Luồng dữ liệu (Data Flow):**
1. **CMS Core Data** (Dự án, Tin tức, Quyên góp): Lưu trữ tại **NeonDB**.
2. **Site Configuration** (Banner, Footer, Số liệu nền): Lưu trữ tại **Browser LocalStorage** (để cấu hình nhanh giao diện mà không cần sửa DB).

---

## 💾 Quản lý Dữ liệu (Database)

Hệ thống đã chuyển từ Mock Data sang Database thực tế.

### **Cấu trúc Bảng (Schema):**
- `projects`: Dự án từ thiện.
- `donations`: Lịch sử đóng góp tiền.
- `volunteers`: Danh sách tình nguyện viên.
- `news`: Tin tức, bài viết truyền thông.
- `funds`: Các quỹ công ích.
- `notices`: Thông báo chạy trên trang chủ.

### **Yêu cầu Môi trường (.env):**
Để hệ thống hoạt động, file `.env` **BẮT BUỘC** phải có biến:
```env
VITE_DATABASE_URL=postgresql://<user>:<pass>@<host>/<dbname>?sslmode=require
```
*Nếu thiếu biến này, trang web sẽ báo lỗi khi tải dữ liệu.*

---

## 📊 Các Module Chức năng

### **1. Thống kê (Dashboard)**
- Hiển thị tổng quan số liệu.
- Số liệu hiển thị = **Base Stats** (Cấu hình nền) + **Real-time Stats** (Dữ liệu thật từ DB).
- *Ví dụ:* Nếu cấu hình nền là 5 tỷ, và có thêm 100 triệu quyên góp mới => Hiển thị 5.1 tỷ.

### **2. Quản lý Dự án (Projects)**
- Thêm/Sửa/Xóa dự án.
- Dữ liệu được đồng bộ trực tiếp lên NeonDB.
- **Lưu ý:** Ảnh hiện tại đang sử dụng URL (chưa có module upload ảnh, cần dùng URL ảnh có sẵn).

### **3. Quản lý Quyên góp (Donations)**
- Hệ thống tự động ghi nhận khi người dùng quyên góp ngoài Frontend.
- Admin có thể xem danh sách nhưng **không được phép sửa/xóa** (Tính minh bạch).

---

## ⚙️ Cấu hình Website (Site Config)

Truy cập: `Admin Panel` -> `Settings`.
Các cấu hình này được lưu ở máy trạm (LocalStorage) của người quản trị.

### **1. Số liệu Nền (Base Stats)**
Dùng để nhập các số liệu lịch sử hoặc số liệu "offline" chưa có trong Database.
- **Raised (Cơ số quyên góp):** Số tiền khởi điểm.
- **Distributed (Đã chi):** Số tiền đã giải ngân.
- **Donors (Lượt quyên góp):** Số lượt người cũ.

### **2. Thông tin Chân trang (Footer)**
- Địa chỉ, Hotline, Email hỗ trợ.
- Tài khoản ngân hàng nhận quyên góp.

---

## 🛠️ Xử lý sự cố (Troubleshooting)

### **Q1: Website không hiện dữ liệu, cứ quay Loading mãi?**
- **Nguyên nhân:** Không kết nối được Database.
- **Khắc phục:**
  1. Kiểm tra file `.env` đã có `VITE_DATABASE_URL` chưa.
  2. Kiểm tra kết nối mạng (Database Neon serverless cần mạng quốc tế ổn định).
  3. Mở F12 (Console) xem lỗi cụ thể.

### **Q2: Tôi đã sửa Footer nhưng người khác không thấy?**
- **Nguyên nhân:** Site Config lưu ở LocalStorage của trình duyệt người đang sửa.
- **Giải pháp:** (Tính năng tạm thời) Cần copy file Config JSON và gửi cho người quản trị khác import (tính năng Import/Export sẽ phát triển sau). Hoặc nâng cấp để lưu Config vào DB `site_config` table.

### **Q3: Làm sao để Reset dữ liệu về mặc định?**
- Vào Settings -> Bấm "Reset to Default".
- Lưu ý: Chỉ reset cấu hình giao diện, **không** xóa dữ liệu trong Database.

---
**Tài liệu cập nhật ngày: 05/01/2026**
