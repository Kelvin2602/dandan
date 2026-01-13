# 📱 Hướng Dẫn Đồng Bộ Navigation Menu

## 🎯 Tổng Quan

Chức năng **Navigation Settings** cho phép admin quản lý menu điều hướng ở Header từ trang Admin, dữ liệu sẽ được lưu vào database và tự động đồng bộ với trang frontend.

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────┐
│   Admin Settings    │  👨‍💼 Admin chỉnh sửa navigation
│   (/admin/settings) │
└──────────┬──────────┘
           │
           ▼ (POST /api/site-config)
┌─────────────────────┐
│   PostgreSQL DB     │  💾 Lưu trữ navigation
│   site_config table │
└──────────┬──────────┘
           │
           ▼ (GET /api/site-config)
┌─────────────────────┐
│ SiteConfigContext   │  🔄 Context đồng bộ
│   (Frontend State)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Header Component  │  🎨 Hiển thị menu
│   (Navigation Bar)  │
└─────────────────────┘
```

---

## 📋 Cách Sử Dụng

### 1️⃣ Truy Cập Admin Settings

1. Đăng nhập với tài khoản admin
2. Vào trang **Admin > Settings** (`/admin/settings`)
3. Cuộn xuống mục **🌐 顶部导航菜单设置**

### 2️⃣ Quản Lý Menu

#### **Thêm Menu Cấp 1**
- Click nút **"➕ 添加一级菜单"**
- Nhập thông tin:
  - **菜单名称**: Tên hiển thị (VD: "首页", "慈善项目")
  - **跳转链接**: Đường dẫn URL (VD: `/`, `/projects`)
  - **ID**: Mã định danh duy nhất (tự động tạo)

#### **Thêm Menu Con (Dropdown)**
- Trong mỗi menu cấp 1, click **"➕ 添加子菜单"**
- Nhập:
  - **子菜单名称**: Tên menu con
  - **跳转链接**: URL của menu con

#### **Xóa Menu**
- Click icon **🗑️ Trash** bên cạnh menu cần xóa

#### **Sắp Xếp Menu**
- Kéo icon **⋮⋮ GripVertical** để di chuyển menu

### 3️⃣ Lưu Cấu Hình

1. Sau khi chỉnh sửa, click nút **💾 保存设置**
2. Hệ thống sẽ:
   - Lưu vào database (PostgreSQL)
   - Cập nhật Context
   - Reload trang frontend tự động

### 4️⃣ Kiểm Tra Kết Quả

- Mở trang chủ (`/`)
- Kiểm tra Header navigation bar
- Menu sẽ tự động cập nhật theo cấu hình mới

---

## 🔧 Cấu Trúc Dữ Liệu

### Database Schema

**Table**: `site_config`
```sql
CREATE TABLE site_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Navigation Data Format**:
```json
{
  "key": "navigation",
  "value": [
    {
      "id": "home",
      "label": "首页",
      "path": "/"
    },
    {
      "id": "info",
      "label": "信息公开",
      "path": "/info",
      "children": [
        {
          "id": "i1",
          "label": "网络资料下载",
          "path": "/info/download"
        }
      ]
    }
  ]
}
```

### TypeScript Interface

```typescript
interface NavItem {
  id: string;
  label: string;
  path: string;
  children?: NavItem[];
}

interface SiteConfig {
  navigation?: NavItem[];
  // ... other fields
}
```

---

## 🚀 Quy Trình Đồng Bộ

### Frontend → Database
```typescript
// pages/Admin/Settings.tsx
const onSubmit = (data: SiteConfig) => {
  updateConfig(data); // → POST /api/site-config
};
```

### Database → Frontend
```typescript
// contexts/SiteConfigContext.tsx
useEffect(() => {
  const loadConfig = async () => {
    const remoteConfig = await SiteConfigAPI.getConfig(); // GET /api/site-config
    setConfig({ ...DEFAULT_CONFIG, ...remoteConfig });
  };
  loadConfig();
}, []);
```

### Display in Header
```typescript
// components/Layout/Header.tsx
const { config } = useSiteConfig();
{(config.navigation || NAV_ITEMS).map((item) => (
  <Link to={item.path}>{item.label}</Link>
))}
```

---

## 🛠️ API Endpoints

### GET `/api/site-config`
**Mô tả**: Lấy toàn bộ cấu hình site (bao gồm navigation)  
**Response**:
```json
{
  "navigation": [...],
  "banners": [...],
  "footer": {...}
}
```

### POST `/api/site-config`
**Mô tả**: Cập nhật cấu hình site  
**Request Body**:
```json
{
  "navigation": [...],
  "headerImage": "...",
  "banners": [...],
  "notices": [...],
  "footer": {...}
}
```

**Response**:
```json
{
  "success": true
}
```

---

## 📝 Seeding Navigation (Dev)

### Script Tự Động
```bash
npx tsx scripts/seed-navigation.ts
```

### SQL Manual
```sql
INSERT INTO site_config (key, value) 
VALUES ('navigation', '[
  {"id":"home","label":"首页","path":"/"},
  {"id":"projects","label":"慈善项目","path":"/projects"}
]')
ON CONFLICT (key) 
DO UPDATE SET value = EXCLUDED.value;
```

---

## ⚠️ Lưu Ý

1. **Tính Nhất Quán**: Khi sửa navigation trong Admin, tất cả pages sẽ tự động cập nhật
2. **Cache**: Nếu không thấy thay đổi, thử hard refresh (`Ctrl+Shift+R`)
3. **ID Duy Nhất**: Mỗi menu item phải có `id` duy nhất để tránh conflict
4. **Path Validation**: Đảm bảo `path` tồn tại trong React Router
5. **Fallback**: Nếu database trống, hệ thống sẽ dùng `NAV_ITEMS` mặc định từ `mockData.ts`

---

## 🐛 Troubleshooting

### Menu không hiển thị sau khi lưu
**Giải pháp**:
1. Kiểm tra console log xem có lỗi API không
2. Verify database: `SELECT value FROM site_config WHERE key = 'navigation'`
3. Hard refresh browser

### Menu bị duplicate
**Nguyên nhân**: Trùng `id`  
**Giải pháp**: Đảm bảo mỗi item có `id` unique

### Dropdown không hoạt động
**Nguyên nhân**: Thiếu `children` array  
**Giải pháp**: Thêm ít nhất 1 menu con hoặc xóa field `children`

---

## 📚 Files Liên Quan

| File | Chức Năng |
|------|-----------|
| `pages/Admin/Settings.tsx` | Admin UI chính |
| `pages/Admin/components/NavigationSettings.tsx` | Component quản lý navigation |
| `contexts/SiteConfigContext.tsx` | Context đồng bộ state |
| `components/Layout/Header.tsx` | Render navigation menu |
| `server/index.ts` | API endpoints |
| `database/schema.sql` | Database schema & seeds |
| `scripts/seed-navigation.ts` | Script seed dữ liệu |

---

## ✅ Checklist Deployment

- [ ] Chạy migration: `npm run migrate`
- [ ] Seed navigation: `npx tsx scripts/seed-navigation.ts`
- [ ] Kiểm tra API: `GET /api/site-config`
- [ ] Test frontend: Mở `/` và click các menu
- [ ] Test admin: Vào `/admin/settings` và thử chỉnh sửa
- [ ] Verify database: Query `site_config` table

---

**Tác Giả**: FSE Agent  
**Ngày Tạo**: 2026-01-11  
**Version**: 1.0.0
