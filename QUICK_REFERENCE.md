# 🚀 Quick Reference Guide

**Hệ thống quản lý từ thiện - 长安仁爱慈善基金会**

---

## 📦 Các Tính Năng Chính

### 1. 🌐 Navigation Sync System
**Mô tả:** Đồng bộ menu từ database, admin có thể edit trực tiếp

**Files liên quan:**
- `pages/Admin/components/NavigationSettings.tsx` (Editor)
- `components/Layout/Header.tsx` (Display)
- `server/index.ts` (`/api/site-config`)

**Sử dụng:**
```tsx
const { config } = useSiteConfig();
const navigation = config.navigation || NAV_ITEMS;
```

---

### 2. 💾 Auto-Save Feature
**Mô tả:** Tự động lưu sau 2s khi user dừng edit

**Files liên quan:**
- `pages/Admin/Settings.tsx` (Logic)

**Implementation:**
```tsx
useEffect(() => {
  if (isDirty) {
    const timer = setTimeout(async () => {
      await SiteConfigAPI.updateConfig(formValues);
      updateConfig(formValues);
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [formValues, isDirty]);
```

---

### 3. 🎯 Site Configuration
**Mô tả:** Quản lý tập trung config toàn site

**Config Structure:**
```typescript
interface SiteConfig {
  headerImage: string;
  banners: string[];
  notices: NoticeItem[];
  navigation: NavItem[];
  footer: FooterConfig;
  baseStats: StatsConfig;
}
```

**API Endpoints:**
- `GET /api/site-config` - Lấy config
- `POST /api/site-config` - Cập nhật config

---

## 🗂️ File Structure

```
dandan/
├── components/
│   ├── Layout/         # Header, Footer, AdminLayout
│   ├── Home/           # HomeBanner, NoticeBar, StatsGrid
│   └── Shared/         # ImageUpload, SEO
├── pages/
│   ├── Admin/          # Dashboard, Settings, Managers
│   │   └── components/ # NavigationSettings, NavigationDebug
│   └── *.tsx           # Public pages
├── contexts/           # AuthContext, DataContext, SiteConfigContext
├── services/           # api.ts, mockData.ts
├── server/             # index.ts (Express backend)
├── database/           # schema.sql, migrate.ts
└── types.ts            # TypeScript interfaces
```

---

## 🔧 Common Tasks

### Thêm Menu Item Mới
1. Vào Admin → Settings
2. Scroll đến "顶部导航菜单设置"
3. Click "添加一级菜单"
4. Nhập: Label, Path, ID
5. (Optional) Add children submenu
6. Auto-save sau 2s
7. Check frontend Header

### Debug Navigation
1. Mở Admin Settings page
2. Click debug panel (bottom-right)
3. Click "Copy JSON" để xem data
4. Click "Test API" để test endpoint

### Reset Config
```sql
-- Option 1: SQL
UPDATE site_config 
SET value = '{"default":"config"}'::jsonb 
WHERE key = 'navigation';

-- Option 2: Admin UI
Admin → Settings → Click "恢复默认"
```

---

## 🧪 Testing Commands

### Backend
```bash
# Start server
npm run server

# Test API
curl http://localhost:3001/api/site-config | jq
```

### Frontend
```bash
# Start dev server
npm run dev

# Build production
npm run build
npm run preview
```

### Database
```bash
# Connect to DB
psql $DATABASE_URL

# Check navigation
SELECT key, value FROM site_config WHERE key = 'navigation';
```

---

## 📊 Component Usage

### Use Site Config
```tsx
import { useSiteConfig } from './contexts/SiteConfigContext';

function MyComponent() {
  const { config, updateConfig } = useSiteConfig();
  
  return (
    <div>
      {config.navigation.map(item => (
        <Link key={item.id} to={item.path}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
```

### Use Auth
```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) return <Login />;
  
  return <Dashboard user={user} />;
}
```

### API Calls
```tsx
import { ProjectsAPI, SiteConfigAPI } from './services/api';

// Get all projects
const projects = await ProjectsAPI.getAll();

// Update config
await SiteConfigAPI.updateConfig(newConfig);
```

---

## 🔍 Debugging Tips

### Check Context State
```tsx
// In any component
const { config } = useSiteConfig();
console.log('Current config:', config);
```

### Check API Response
```bash
# Browser DevTools → Network tab
# Look for: /api/site-config
# Check: Response JSON structure
```

### Check Database
```sql
-- See all config
SELECT * FROM site_config;

-- See navigation
SELECT value FROM site_config WHERE key = 'navigation';

-- Count menu items
SELECT jsonb_array_length(value) as count 
FROM site_config 
WHERE key = 'navigation';
```

---

## 🚨 Common Issues

### Issue: Auto-save not working
**Symptoms:** Changes không được lưu
**Fix:**
1. Check browser console for errors
2. Check Network tab for API calls
3. Verify database connection
4. Check `SiteConfigAPI.updateConfig()` function

### Issue: Navigation not displaying
**Symptoms:** Menu không hiển thị
**Fix:**
1. Open NavigationDebug panel
2. Check API response in Network tab
3. Verify `useSiteConfig()` hook
4. Check fallback to NAV_ITEMS

### Issue: F5 loses data
**Symptoms:** Refresh mất dữ liệu
**Fix:**
1. Verify auto-save completed before F5
2. Check database has data
3. Check API load on mount
4. Verify SiteConfigProvider initialization

---

## 📚 Documentation Links

### Full Documentation
- [System Sync Report](./docs/SYSTEM_SYNC_REPORT.md) - Chi tiết đồng bộ
- [Architecture](./docs/ARCHITECTURE.md) - Kiến trúc hệ thống
- [Update Checklist](./docs/UPDATE_CHECKLIST.md) - Checklist cập nhật
- [Sync Complete](./SYNC_COMPLETE.md) - Báo cáo hoàn thành

### Feature Docs
- [Navigation Tests](./TEST_RESULTS_NAVIGATION.md) - Kết quả test
- [Auto-Save Feature](./FEATURE_AUTO_SAVE_DATABASE.md) - Tài liệu auto-save
- [Save Button Fix](./HOTFIX_SAVE_BUTTON.md) - Fix save button

### API Docs
- [Backend API](./docs/backend.md) - API endpoints
- [Admin Guide](./ADMIN_GUIDE.md) - Hướng dẫn admin

---

## 💡 Best Practices

### When Adding New Features
1. Update `types.ts` first (TypeScript interfaces)
2. Update backend API endpoints
3. Update database schema if needed
4. Update Context provider
5. Create/update components
6. Add to Admin Settings if configurable
7. Update documentation

### When Editing Config
1. Always use Admin UI (not direct DB edits)
2. Let auto-save complete (wait 2s)
3. Verify "saved" indicator shows
4. Test on frontend before F5

### When Debugging
1. Check NavigationDebug panel first
2. Then check browser console
3. Then check Network tab
4. Then check database
5. Finally check backend logs

---

## 🎯 Quick Commands

```bash
# Development
npm run dev              # Start frontend (Port 5173)
npm run server           # Start backend (Port 3001)

# Production
npm run build            # Build frontend
npm run preview          # Preview build
npm start                # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed data
npm run db:reset         # Reset database

# Testing
npm test                 # Run tests (if configured)
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
```

---

## 📞 Quick Support

### Get Help
1. Check this Quick Reference first
2. Then check Full Documentation
3. Check browser DevTools console
4. Check NavigationDebug panel

### Report Issues
1. Describe the issue
2. Include: Browser, Steps to reproduce
3. Include: Screenshots, Console errors
4. Include: Network tab responses

---

## ✅ Health Check

### System Status
```bash
# Check backend
curl http://localhost:3001/api/health

# Check database
psql $DATABASE_URL -c "SELECT 1;"

# Check frontend
curl http://localhost:5173
```

### Expected Responses
- Backend: `{"status":"ok","timestamp":"..."}`
- Database: `1`
- Frontend: `HTML content`

---

**Cập nhật:** 2026-01-11  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
