# 🧠 AGENT MENTAL MAP & PLAN

## 1. Phân tích dự án (Basic Analysis)

### Tổng quan
Dự án **"Xi'an Charity Association Portal"** là một ứng dụng web Full-stack sử dụng React + TypeScript + Vite kết nối với cơ sở dữ liệu serverless NeonDB (PostgreSQL).

- **Mục tiêu**: Nền tảng gây quỹ từ thiện, quản lý tình nguyện viên, và công khai thông tin minh bạch.
- **Trạng thái**: Prototype đã có Databse integration nhưng tài liệu (ADMIN_GUIDE) vẫn mô tả phiên bản cũ dùng LocalStorage.

### Kiến trúc (Architecture)
- **Frontend**: React 18, React Router v6, TailwindCSS.
- **Backend/DB**: Serverless SQL via `@neondatabase/serverless` (Logic nằm trực tiếp ở Frontend Service Layer).
- **State Management**:
  - `AuthContext`: Quản lý đăng nhập (đang hardcode demo-token).
  - `DataContext`: Trung gian gọi API lấy dữ liệu thực tế từ DB.
  - `SiteConfigContext`: Quản lý cấu hình giao diện (Banner, Footer) lưu ở LocalStorage.

## 2. Chi tiết Modules Code (Code Inspection Findings)

### A. Core Configuration
- `vite.config.ts`: Cấu hình Proxy và Alias (`@`). Load biến môi trường `GEMINI_API_KEY`.
- `types.ts`: Định nghĩa Interface (Project, Fund, NewsItem, Volunteer, ...).
- `package.json`: Dependencies chính gồm `lucide-react`, `react-router-dom`, `@neondatabase/serverless`.

### B. Service Layer (Quan trọng)
- **`services/api.ts`**:
  - Chứa toàn bộ logic truy vấn SQL (`SELECT`, `INSERT`, `UPDATE`).
  - Các bảng đã định nghĩa: `projects`, `funds`, `news`, `donations`, `volunteers`, `notices`.
  - **Lưu ý**: Code này yêu cầu biến môi trường kết nối DB (DATABASE_URL) để chạy được, nếu không sẽ lỗi.
- **`services/mockData.ts`**:
  - Dữ liệu mẫu tĩnh. Hiện tại chỉ dùng cho Menu (`NAV_ITEMS`) ở Header. Phần dữ liệu nội dung (Projects, Donations) đang KHÔNG được sử dụng bởi `DataContext` (đã chuyển sang dùng API).

### C. Contexts
- `AuthContext`: Đơn giản, dùng LocalStorage để lưu cờ `isAuthenticated`.
- `DataContext`:
  - `loadData()`: Gọi song song 5 API (Projects, Volunteers, Donations, News, Funds).
  - Chứa logic `addProject`, `addDonation` gọi xuống `api.ts`.
- `SiteConfigContext`:
  - Quản lý cấu hình động cho Header/Footer.
  - Có logic fallback: Nếu LocalStorage trống -> lấy `DEFAULT_CONFIG`.

### D. UI Components
- **Layout**: `Header.tsx` (Menu, Marquee), `Footer.tsx` (Thông tin liên hệ từ Config).
- **pages/Home.tsx**:
  - Dashboard chính cho người dùng.
  - Sử dụng các component con: `HomeBanner` (Slider), `NoticeBar` (Thông báo chạy), `StatsGrid` (Thống kê cứng - Hardcoded), `DonationTable`.
- **Admin**:
  - `AdminLayout`: Sidebar quản lý.
  - Các trang Dashboard, ProjectManager, Settings...

## 3. Discrepancies (Sự không nhất quán)
1. **Tài liệu vs Code**: `ADMIN_GUIDE.md` nói dữ liệu lưu ở LocalStorage, nhưng `DataContext.tsx` + `api.ts` đã chuyển sang dùng NeonDB. Điều này sẽ gây hiểu nhầm cho người mới setup.
2. **Hardcoded Data**: Component `StatsGrid.tsx` đang fix cứng số liệu ("5.42亿", "4.89亿") thay vì lấy từ `DonationsAPI.getTotalRaised()`.

## 4. Kế hoạch (Action Plan)

### Giai đoạn 1: Ổn định hóa (Stabilization)
- [ ] Kiểm tra kết nối Database (file `.env`).
- [ ] Cập nhật `StatsGrid.tsx` để hiển thị số liệu thực tế từ DB.
- [ ] Đồng bộ lại `ADMIN_GUIDE.md` cho khớp với hiện trạng Code (DB-based).

### Giai đoạn 2: Tối ưu (Optimization)
- [ ] Refactor `AuthContext` để dùng JWT thực tế thay vì "demo-token".
- [ ] Thêm caching cho các API request để giảm tải DB load khi refresh trang.
- [ ] Implement phần "Upload Image" thực tế thay vì dùng placeholder URL.

### Giai đoạn 3: Mở rộng (Expansion)
- [ ] Thêm trang "Báo cáo tài chính" (đang placeholder).
- [ ] Thêm tính năng Export Excel cho Admin.
