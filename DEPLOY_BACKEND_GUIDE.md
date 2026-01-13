# Hướng dẫn Deploy Backend lên Render (Miễn phí)

Web trên Netlify hiện tại bị lỗi vì nó không thể kết nối với Backend đang chạy ở `localhost`. Bạn cần đưa Backend lên mạng.

## 1. Tại sao phải làm bước này?

- **Netlify** chỉ chứa giao diện (Frontend).
- **Backend (Server)** và **Database** cần một nơi khác để chạy.
- Hiện tại bạn mới chỉ deploy Frontend, nên web không lấy được dữ liệu.

## 2. Các bước Deploy Backend lên Render.com

### Bước 1: Đăng ký/Đăng nhập Render

1. Truy cập [render.com](https://render.com).
2. Đăng nhập bằng tài khoản **GitHub**.

### Bước 2: Tạo Web Service mới

1. Chọn nút **"New +"** -> **"Web Service"**.
2. Chọn **"Build and deploy from a Git repository"**.
3. Kết nối với repository: `tungvu82nt/dandan`.

### Bước 3: Cấu hình Service

Điền các thông tin sau:

- **Name:** `dandan-backend` (hoặc tên tùy thích)
- **Region:** Singapore (để gần Việt Nam nhất)
- **Branch:** `main`
- **Root Directory:** `.` (để trống hoặc dấu chấm)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free

### Bước 4: Cài đặt Biến môi trường (Environment Variables)

Kéo xuống phần **Environment Variables**, thêm các giá trị quan trọng từ file `.env` của bạn:

| Key            | Value                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL` | `postgresql://neondb_owner:...` (Chuỗi kết nối NeonDB của bạn)               |
| `PORT`         | `3001` (Hoặc mặc định Render sẽ tự cấp, nhưng set 3001 cho chắc)             |
| `cors_origin`  | `https://glowing-zuccutto-bbe5c5.netlify.app` (Để cho phép Frontend gọi vào) |

_(Lưu ý: Không dùng `localhost` ở đây)_

### Bước 5: Deploy

- Bấm **"Create Web Service"**.
- Chờ khoảng 2-3 phút để Render cài đặt và khởi động server.
- Khi hoàn tất, bạn sẽ thấy trạng thái **Live** và một đường link dạng: `https://dandan-backend.onrender.com`.

---

## 3. Cập nhật lại Netlify (Bước cuối)

Sau khi có link backend từ Render (ví dụ: `https://dandan-backend.onrender.com`), bạn quay lại **Netlify**:

1. Vào **Site configuration** -> **Environment variables**.
2. Sửa (hoặc thêm) biến `VITE_API_BASE_URL`.
3. Điền giá trị mới: `https://dandan-backend.onrender.com/api` (Nhớ thêm `/api` ở cuối).
4. Lưu lại.
5. Vào tab **Deploys** -> **Trigger deploy** -> **Clear cache and deploy site**.

=> Sau đó Web của bạn sẽ hoạt động hoàn toàn!
