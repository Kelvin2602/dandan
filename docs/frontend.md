# Tài liệu Kỹ thuật Frontend

## 1. Kiến trúc Tổng quan
Ứng dụng được xây dựng theo mô hình **Single Page Application (SPA)** sử dụng React 18. Hệ thống được chia tách rõ ràng giữa giao diện người dùng (Public) và giao diện quản trị (Admin) thông qua Layout Routing.

## 2. Component System
Chúng tôi áp dụng Atomic Design ở mức độ cơ bản:

### Shared Components (`src/components/Shared`)
Các thành phần nhỏ, không chứa logic nghiệp vụ phức tạp:
*   `SEO.tsx`: Quản lý thẻ Meta tag cho từng trang.
*   `Card.tsx`: Thẻ hiển thị dự án chuẩn hóa.

### Layout Components (`src/components/Layout`)
*   `PublicLayout`: Bao gồm `Header` (Navigation, Banner) và `Footer`. Có nút "Back to Top".
*   `AdminLayout`: Bao gồm Sidebar quản trị, Header Admin và khu vực Content động. Sử dụng `Outlet` của React Router.

### Feature Components
Các component gắn liền với logic của từng trang:
*   `Home/`: `NoticeBar`, `StatsGrid`, `DonationTable`.
*   `Admin/`: Các modal form, bảng dữ liệu quản trị.

## 3. State Management (Quản lý Trạng thái)

Thay vì sử dụng Redux hay Zustand, ứng dụng sử dụng **React Context API** để quản lý trạng thái, phù hợp với quy mô hiện tại và giảm bundle size.

### a. `DataContext` (Quan trọng nhất)
Đây là "trái tim" của ứng dụng, đóng vai trò như một Database client-side.
*   **Dữ liệu:** `projects`, `donations`, `volunteers`, `news`, `funds`.
*   **Actions:** `addDonation`, `addProject`, `updateVolunteerStatus`, v.v.
*   **Cơ chế:** Khi có thay đổi (ví dụ: người dùng quyên góp), State được cập nhật -> Giao diện re-render -> Dữ liệu lưu xuống `localStorage`.

### b. `AuthContext`
*   Quản lý trạng thái đăng nhập của Admin.
*   Lưu token (giả lập) vào `localStorage`.

### c. `SiteConfigContext`
*   Cho phép Admin cấu hình giao diện (Banner, thông tin Footer) mà không cần sửa code.
*   Dữ liệu cấu hình được persist (lưu trữ) lâu dài.

## 4. Routing & Performance
*   **Lazy Loading:** Toàn bộ các trang (`pages/*`) đều được import sử dụng `React.lazy()` và `Suspense`. Điều này giúp giảm thời gian tải trang ban đầu (FCP).
*   **Protected Route:** Route `/admin/*` được bảo vệ bởi component `ProtectedRoute`, sẽ chuyển hướng về login nếu chưa xác thực.

## 5. Styling
*   Sử dụng **Tailwind CSS** với cấu hình custom (`tailwind.config.js`) để khớp chính xác mã màu và font chữ theo thiết kế gốc.
*   Bảng màu chính:
    *   `primary`: `#ca231e` (Đỏ thương hiệu)
    *   `accent`: `#fc960c` (Cam điểm nhấn)
    *   `bgBlock`: `#f5f6f7` (Nền khối nội dung)
