# 📊 Database Migration Guide - NeonDB Integration

## 🎯 Tổng Quan

Hướng dẫn này giúp bạn migrate toàn bộ mock data sang **NeonDB (PostgreSQL)** và tích hợp backend thực tế vào project.

---

## 🏗️ Architecture Hiện Tại

### **Phase 1: Mock Data (Hiện tại)**
```
Frontend → LocalStorage → Mock Data
```

### **Phase 2: Database Integration (Mục tiêu)**
```
Frontend → API Layer → NeonDB PostgreSQL
```

---

## 📋 Các Bước Thực Hiện

### **BƯỚC 1: Chuẩn Bị Database**

#### 1.1. Verify NeonDB Connection
```bash
psql 'postgresql://neondb_owner:npg_FxuKOEG3i9YV@ep-cool-darkness-a148vh1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

Kiểm tra connect thành công:
```sql
SELECT NOW();
```

#### 1.2. Chạy Schema Migration
Copy nội dung file `database/schema.sql` và execute trong psql hoặc Neon Console:

```bash
# Option 1: Từ command line
psql '<connection-string>' -f database/schema.sql

# Option 2: Copy-paste vào Neon SQL Editor
# Truy cập: https://console.neon.tech
# Chọn database → SQL Editor → Paste schema.sql → Execute
```

#### 1.3. Seed Initial Data
Tương tự, execute `database/seed.sql`:

```bash
psql '<connection-string>' -f database/seed.sql
```

---

### **BƯỚC 2: Verify Migration**

Kiểm tra data đã được import:

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check record counts
SELECT 'projects' as table, COUNT(*) as records FROM projects
UNION ALL
SELECT 'funds', COUNT(*) FROM funds
UNION ALL
SELECT 'news', COUNT(*) FROM news
UNION ALL
SELECT 'donations', COUNT(*) FROM donations
UNION ALL
SELECT 'volunteers', COUNT(*) FROM volunteers
UNION ALL
SELECT 'notices', COUNT(*) FROM notices;
```

Kết quả mong đợi:
```
projects   | 4
funds      | 4
news       | 5
donations  | 8
volunteers | 3
notices    | 3
```

---

### **BƯỚC 3: Cấu Hình Environment**

#### 3.1. Copy `.env.example` → `.env`
```bash
cp .env.example .env
```

#### 3.2. Cập nhật `.env`
```env
DATABASE_URL=postgresql://neondb_owner:npg_FxuKOEG3i9YV@ep-cool-darkness-a148vh1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

VITE_API_BASE_URL=http://localhost:3001/api
PASSWORD_SALT_ROUNDS=10
```

---

### **BƯỚC 4: Test Connection (Optional)**

Tạo file test nhanh:

```typescript
// test-db.ts
import { testConnection } from './database/db';

testConnection().then(success => {
  if (success) {
    console.log('✅ Database connection successful!');
  } else {
    console.log('❌ Database connection failed!');
  }
  process.exit(success ? 0 : 1);
});
```

Chạy:
```bash
npx tsx test-db.ts
```

---

## 🔄 Migration Strategy

### **Option A: Manual Migration (Khuyên dùng cho Production)**

**Ưu điểm:**
- Kiểm soát hoàn toàn
- Review từng bước
- An toàn, không mất data

**Các bước:**
1. Chạy `schema.sql` manually trong Neon Console
2. Chạy `seed.sql` để import data mẫu
3. Verify kết quả bằng SQL queries
4. Backup database (Neon có auto backup)

---

### **Option B: Automated Migration Script**

**Sử dụng file `database/migrate.ts`:**

```bash
# Cài dependencies
npm install tsx @types/node

# Chạy migration
npx tsx database/migrate.ts
```

Script sẽ:
1. ✅ Test connection
2. ✅ Create tables (skip nếu đã tồn tại)
3. ✅ Seed initial data
4. ✅ Verify record counts

---

## 📊 Database Schema Overview

### **Tables Created:**

| Table | Purpose | Records |
|-------|---------|---------|
| `projects` | Dự án từ thiện | 4 |
| `funds` | Quỹ công ích | 4 |
| `news` | Tin tức | 5 |
| `donations` | Lịch sử quyên góp | 8 |
| `volunteers` | Tình nguyện viên | 3 |
| `notices` | Thông báo chạy | 3 |
| `site_config` | Cấu hình web | 3 |
| `admin_users` | Admin accounts | 1 |

### **Relations:**
- `donations.project_id` → `projects.id` (Foreign Key)
- Các bảng khác standalone

### **Indexes:**
- Performance indexes trên `status`, `category`, `date` columns
- Tự động update `updated_at` trigger

---

## 🔌 API Integration (Next Steps)

### **Phase 2A: API Service Layer** (Đã tạo sẵn)

File `services/api.ts` cung cấp:
- `ProjectsAPI` - CRUD operations
- `FundsAPI` - CRUD operations
- `NewsAPI` - CRUD operations
- `DonationsAPI` - Create + List
- `VolunteersAPI` - CRUD + Status update
- `NoticesAPI` - CRUD operations
- `SiteConfigAPI` - Get/Set config

---

### **Phase 2B: Context Migration**

Migrate từ LocalStorage → API calls:

**Hiện tại (Mock):**
```typescript
const [projects, setProjects] = useState(MOCK_PROJECTS);
```

**Sau khi migrate (API):**
```typescript
const [projects, setProjects] = useState([]);

useEffect(() => {
  ProjectsAPI.getAll().then(setProjects);
}, []);
```

---

### **Phase 2C: Backend API Server** (Optional - Production)

Để an toàn hơn, tạo Node.js Express API:

```bash
# Trong folder riêng
mkdir backend && cd backend
npm init -y
npm install express @neondatabase/serverless cors dotenv
```

Tạo Express endpoints:
```javascript
// backend/server.js
app.get('/api/projects', async (req, res) => {
  const projects = await ProjectsAPI.getAll();
  res.json(projects);
});
```

Deploy backend lên:
- Vercel Serverless Functions
- Railway
- Heroku
- Hoặc cùng Netlify Functions

---

## 🛡️ Security Considerations

### **Hiện Tại (Development)**
- ⚠️ Frontend gọi trực tiếp NeonDB (chỉ để development)
- ⚠️ Connection string exposed trong code

### **Production (Khuyến nghị)**
- ✅ Tạo Backend API riêng
- ✅ Hide DATABASE_URL trong server env
- ✅ Implement authentication (JWT)
- ✅ Rate limiting & validation
- ✅ Input sanitization

---

## 📝 Checklist Migration

- [ ] ✅ NeonDB account đã tạo
- [ ] ✅ Connection string đã test thành công
- [ ] ✅ Schema.sql đã execute
- [ ] ✅ Seed.sql đã execute
- [ ] ✅ Verify data trong database
- [ ] ✅ File `.env` đã cấu hình
- [ ] ✅ Dependencies đã install (`@neondatabase/serverless`)
- [ ] ✅ Test API service layer
- [ ] 🔲 Migrate Context từ LocalStorage → API
- [ ] 🔲 Update tất cả components
- [ ] 🔲 Testing toàn bộ flows
- [ ] 🔲 Deploy production

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to database"
**Giải pháp:**
1. Check connection string đúng
2. Verify Neon project đang active
3. Check firewall/network
4. Test bằng psql command line

---

### Lỗi: "Table already exists"
**Giải pháp:**
- Bình thường! Script đã handle duplicate
- Hoặc drop tables trước:
  ```sql
  DROP TABLE IF EXISTS donations, volunteers, notices, news, funds, projects, site_config, admin_users CASCADE;
  ```

---

### Lỗi: "Permission denied"
**Giải pháp:**
- Check user có quyền CREATE TABLE
- Verify đang dùng đúng database `neondb`

---

## 📚 Resources

- **NeonDB Docs**: https://neon.tech/docs
- **Neon Console**: https://console.neon.tech
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## 🎯 Summary

✅ **Đã hoàn thành:**
- Schema design (8 tables)
- Migration scripts (schema.sql + seed.sql)
- API service layer (services/api.ts)
- Database utility (database/db.ts)

🔲 **Còn lại:**
- Chạy migration vào NeonDB
- Migrate Context sử dụng API
- Update components
- Testing & deployment

---

**Tác giả:** AI Assistant  
**Ngày tạo:** 2025-01-05  
**Version:** 1.0.0
