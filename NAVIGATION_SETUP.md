# 🧭 Navigation Setup Guide

## 🚀 Quick Start

### 1. Database Migration (Bao gồm Navigation Seed)
```bash
npm run migrate
```

### 2. Hoặc chỉ seed Navigation riêng
```bash
npm run seed:nav
```

### 3. Setup đầy đủ (Migration + Navigation)
```bash
npm run db:setup
```

---

## 📋 Scripts Có Sẵn

| Command | Mô tả |
|---------|-------|
| `npm run migrate` | Chạy database migration (schema.sql) |
| `npm run seed:nav` | Seed navigation menu vào database |
| `npm run db:setup` | Migration + Seed navigation (all-in-one) |

---

## ✅ Verify Navigation

### Kiểm tra Database
```sql
SELECT value FROM site_config WHERE key = 'navigation';
```

### Test API
```bash
curl http://localhost:3001/api/site-config
```

Kết quả phải có field `navigation`:
```json
{
  "navigation": [
    {"id":"home","label":"首页","path":"/"},
    ...
  ],
  "banners": [...],
  "footer": {...}
}
```

---

## 🎨 Admin UI

1. Đăng nhập: `http://localhost:3000/admin/login`
2. Vào Settings: `http://localhost:3000/admin/settings`
3. Scroll xuống **🌐 顶部导航菜单设置**
4. Chỉnh sửa menu (thêm/xóa/sửa)
5. Click **💾 保存设置**
6. Reload trang chủ → Menu tự động cập nhật!

---

## 🔧 Troubleshooting

### Navigation không hiển thị?

**Kiểm tra:**
1. Database có data chưa? → Chạy `npm run seed:nav`
2. API trả về navigation? → Test: `curl http://localhost:3001/api/site-config`
3. SiteConfigContext load đúng chưa? → Xem Console log
4. Hard refresh browser: `Ctrl+Shift+R`

### Menu bị trùng hoặc lỗi format?

**Giải pháp:**
```sql
-- Xóa navigation cũ
DELETE FROM site_config WHERE key = 'navigation';

-- Chạy lại seed
npm run seed:nav
```

---

## 📁 Files Liên Quan

```
database/
  ├── schema.sql          # Database schema + seeds (bao gồm navigation)
  └── migrate.ts          # Migration script + verify navigation

scripts/
  └── seed-navigation.ts  # Seed navigation riêng biệt

pages/Admin/
  ├── Settings.tsx                          # Admin Settings UI
  └── components/NavigationSettings.tsx     # Navigation manager component

components/Layout/
  └── Header.tsx          # Hiển thị navigation menu

contexts/
  └── SiteConfigContext.tsx  # Context đồng bộ state

services/
  └── api.ts              # SiteConfigAPI

docs/
  └── navigation-sync-guide.md  # Hướng dẫn chi tiết
```

---

## 💡 Best Practices

1. **Backup trước khi migration**: Xuất database trước khi chạy `npm run migrate`
2. **Test trên local**: Verify navigation hoạt động local trước khi deploy
3. **Version control**: Commit changes vào Git sau mỗi lần chỉnh sửa navigation
4. **Consistent IDs**: Đảm bảo mỗi menu item có `id` unique
5. **Valid Paths**: Kiểm tra `path` tồn tại trong React Router

---

**Last Updated**: 2026-01-11  
**Version**: 1.0.0
