# 🔧 HOTFIX - Notices Field Migration

## Vấn đề
Khi khởi động lại web sau khi thêm field `notices` vào `SiteConfig`, xuất hiện lỗi:

```
Uncaught TypeError: config.notices is not iterable
```

## Nguyên nhân
LocalStorage cũ không có field `notices`, khi code cố gắng spread `[...config.notices, ...]` gây lỗi.

## Giải pháp

### 1. **NoticeBar.tsx** - Thêm fallback
```typescript
const notices = config.notices || [];
const repeatedNotices = [...notices, ...notices];
```

### 2. **SiteConfigContext.tsx** - Merge với DEFAULT_CONFIG
```typescript
useEffect(() => {
  const savedConfig = localStorage.getItem('siteConfig');
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig);
      // Merge để đảm bảo có đầy đủ fields mới
      setConfig({
        ...DEFAULT_CONFIG,
        ...parsed,
        notices: parsed.notices || DEFAULT_CONFIG.notices
      });
    } catch (e) {
      console.error("Failed to parse site config", e);
    }
  }
}, []);
```

## Cách reset nhanh (nếu vẫn lỗi)

### Option 1: Xóa LocalStorage qua DevTools Console
```javascript
localStorage.removeItem('siteConfig');
location.reload();
```

### Option 2: Xóa qua Application Tab
1. Mở DevTools (F12)
2. Tab "Application" → "Local Storage"
3. Xóa key `siteConfig`
4. Reload trang (F5)

### Option 3: Dùng nút "恢复默认" trong Admin
1. Vào `/admin/settings`
2. Click nút "🔄 恢复默认" góc trên bên phải
3. Confirm → Data reset về mặc định có đầy đủ field `notices`

## Status
✅ Fixed - Code đã có fallback an toàn, tương thích ngược với LocalStorage cũ
