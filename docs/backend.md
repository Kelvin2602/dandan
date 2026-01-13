# Cơ chế Xử lý Dữ liệu (Backend Simulation)

Hiện tại, dự án hoạt động dưới dạng **Serverless Client-side App**. Backend và Database được giả lập hoàn toàn bằng trình duyệt thông qua `LocalStorage` và `React Context`.

## 1. Mô hình Dữ liệu (Schema)

Dù không có Database thực, chúng tôi định nghĩa các Interface TypeScript chặt chẽ để đảm bảo tính nhất quán dữ liệu (`src/types.ts`).

### a. Project (Dự án Từ thiện)

```typescript
interface Project {
  id: string;
  title: string;       // Tên dự án
  target: number;      // Mục tiêu quyên góp
  raised: number;      // Đã quyên góp (Tự động tăng khi có Donation)
  donors: number;      // Số người quyên góp
  status: 'active' | 'completed' | 'pending';
  // ... các trường hiển thị khác
}
```

### b. DonationRecord (Bản ghi Quyên góp)

```typescript
interface DonationRecord {
  id: string;
  date: string;        // YYYY-MM-DD
  donor: string;       // Tên người quyên góp
  amount: number;      // Số tiền
  projectTitle: string;// Tên dự án được quyên góp
  payType: string;     // WeChat/Alipay...
  channel: string;     // PC/Mobile
}
```

### c. Volunteer (Tình nguyện viên)

```typescript
interface Volunteer {
  id: number;
  name: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected'; // Trạng thái duyệt
  // ... thông tin cá nhân
}
```

## 2. Cơ chế Đồng bộ Client - Admin

Đây là điểm mấu chốt để hệ thống hoạt động như một ứng dụng Full-stack thực thụ:

1. **Khởi tạo:** Khi ứng dụng tải lần đầu, `DataContext` kiểm tra `localStorage`.

   * Nếu trống: Load dữ liệu mẫu từ `src/services/mockData.ts`.
   * Nếu có: Load dữ liệu từ `localStorage`.
2. **Ghi (Write):**

   * Khi User thực hiện hành động (ví dụ: Quyên góp tại `ProjectDetail`), hàm `addDonation` trong Context được gọi.
   * Hàm này thực hiện 2 việc nguyên tử (atomic):
     1. Thêm bản ghi vào mảng `donations`.
     2. Tìm `project` tương ứng và cập nhật `raised += amount`.
   * `useEffect` trong Context sẽ tự động bắt sự thay đổi state và ghi đè lại vào `localStorage`.
3. **Đọc (Read):**

   * Trang Admin (`DonationManager`) subscribe vào `DataContext`.
   * Do cùng sử dụng một nguồn dữ liệu (Context), Admin sẽ thấy thay đổi ngay lập tức mà không cần F5 (nhờ React reactivity).

## 3. Lộ trình Nâng cấp (Future Backend)

Để chuyển đổi sang hệ thống production thực tế, cần thực hiện các bước:

1. **Xây dựng API Server:**

   * Công nghệ đề xuất: **Node.js (Express/NestJS)** hoặc **Go (Gin)**.
   * Endpoints cần thiết:
     * `GET /api/projects`, `POST /api/projects`
     * `POST /api/donations` (Cần tích hợp Payment Gateway thật).
     * `POST /api/auth/login` (Thay thế Auth giả lập).
2. **Cơ sở dữ liệu:**

   * Công nghệ đề xuất: **PostgreSQL** hoặc **MongoDB**.
   * Di chuyển dữ liệu từ `mockData` sang DB.
3. **Thay thế DataContext:**

   * Sửa `DataContext` để thay vì gọi `localStorage`, nó sẽ gọi `fetch()` hoặc `axios` tới API Server.
