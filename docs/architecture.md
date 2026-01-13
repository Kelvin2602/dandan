# 🏗️ System Architecture

**Project:** 长安仁爱慈善基金会管理系统
**Version:** 1.0.0
**Last Updated:** 2026-01-11

---

## 📐 Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  React Application                          │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │   Pages      │  │  Components  │  │   Contexts   │    │ │
│  │  │              │  │              │  │              │    │ │
│  │  │ - Home       │  │ - Header     │  │ - AuthContext│    │ │
│  │  │ - Projects   │  │ - Footer     │  │ - DataContext│    │ │
│  │  │ - Admin/*    │  │ - Shared/*   │  │ - SiteConfig │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐                       │ │
│  │  │   Services   │  │    Types     │                       │ │
│  │  │              │  │              │                       │ │
│  │  │ - api.ts     │  │ - types.ts   │                       │ │
│  │  │ - mockData   │  │ - interfaces │                       │ │
│  │  └──────────────┘  └──────────────┘                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTP/HTTPS
                                │ REST API
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        SERVER (Node.js)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Express.js Backend                             │ │
│  │                                                              │ │
│  │  Routes:                                                     │ │
│  │  ├─ /api/auth/*         - Authentication                   │ │
│  │  ├─ /api/projects/*     - Projects CRUD                    │ │
│  │  ├─ /api/news/*         - News CRUD                        │ │
│  │  ├─ /api/funds/*        - Funds CRUD                       │ │
│  │  ├─ /api/donations/*    - Donations                        │ │
│  │  ├─ /api/volunteers/*   - Volunteer Management             │ │
│  │  ├─ /api/notices/*      - Notices                          │ │
│  │  ├─ /api/site-config    - Site Configuration               │ │
│  │  └─ /api/upload         - File Upload                      │ │
│  │                                                              │ │
│  │  Middleware:                                                 │ │
│  │  ├─ CORS                                                    │ │
│  │  ├─ JSON Parser                                             │ │
│  │  ├─ Multer (File Upload)                                    │ │
│  │  └─ Error Handling                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ PostgreSQL Driver (pg)
                                │ Connection Pool
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
│                                                                   │
│  Tables:                                                          │
│  ├─ users              - Admin users                            │
│  ├─ projects           - Charity projects                       │
│  ├─ news               - News articles                          │
│  ├─ funds              - Charity funds                          │
│  ├─ donations          - Donation records                       │
│  ├─ volunteers         - Volunteer applications                 │
│  ├─ notices            - Notice board items                     │
│  ├─ categories         - Content categories                     │
│  ├─ banners            - Homepage banners                       │
│  └─ site_config        - Site configuration (JSONB)             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Patterns

### Pattern 1: Server-Side Rendering (SSR)

```
User Request → Vite Dev Server → React Router → Page Component → Render
```

### Pattern 2: Client-Side Data Fetching

```
Component Mount
  → useEffect Hook
  → API Service Call
  → Backend API
  → Database Query
  → JSON Response
  → State Update
  → Re-render
```

### Pattern 3: Form Submission

```
User Input
  → React Hook Form
  → Validation
  → onSubmit Handler
  → API Service
  → Backend Endpoint
  → Database Transaction
  → Success/Error Response
  → UI Feedback
```

### Pattern 4: Context State Management

```
App.tsx
  → Context Provider (Auth/Data/SiteConfig)
  → Initial Data Load
  → State Distribution
  → Child Components
  → useContext Hook
  → Render with Context Data
```

---

## 🗂️ Folder Structure

```
dandan/
├── components/          # Reusable UI components
│   ├── Home/           # Homepage-specific components
│   │   ├── HomeBanner.tsx
│   │   ├── NoticeBar.tsx
│   │   ├── StatsGrid.tsx
│   │   └── ...
│   ├── Layout/         # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AdminLayout.tsx
│   └── Shared/         # Shared utilities
│       ├── ImageUpload.tsx
│       ├── SEO.tsx
│       └── ...
│
├── pages/              # Page-level components (Routed)
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── NewsDetail.tsx
│   ├── Admin/          # Admin panel pages
│   │   ├── Dashboard.tsx
│   │   ├── Settings.tsx
│   │   ├── ProjectManager.tsx
│   │   ├── DonationManager.tsx
│   │   └── components/ # Admin sub-components
│   │       ├── NavigationSettings.tsx
│   │       └── NavigationDebug.tsx
│   └── ...
│
├── contexts/           # React Context providers
│   ├── AuthContext.tsx       # Authentication state
│   ├── DataContext.tsx       # Global data (projects, news, etc.)
│   └── SiteConfigContext.tsx # Site configuration
│
├── services/           # API client & mock data
│   ├── api.ts          # API service functions
│   └── mockData.ts     # Fallback/default data
│
├── server/             # Backend server
│   └── index.ts        # Express.js API server
│
├── database/           # Database scripts
│   ├── schema.sql      # Database schema
│   └── migrate.ts      # Migration utilities
│
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component
├── index.tsx           # App entry point
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies

```

---

## 🧩 Core Modules

### 1. Authentication Module

**Files:**

- `contexts/AuthContext.tsx`
- `pages/Admin/Login.tsx`
- `server/index.ts` (routes: `/api/auth/*`)

**Flow:**

```
Login Form
  → AuthAPI.login(username, password)
  → POST /api/auth/login
  → bcrypt.compare(password, hash)
  → JWT Token Generation
  → localStorage.setItem('token')
  → AuthContext.setUser()
  → Protected Routes Access
```

**Features:**

- Password hashing with bcrypt
- Token-based authentication
- Session persistence
- Protected admin routes

---

### 2. Site Configuration Module

**Files:**

- `contexts/SiteConfigContext.tsx`
- `pages/Admin/Settings.tsx`
- `pages/Admin/components/NavigationSettings.tsx`
- `server/index.ts` (routes: `/api/site-config`)

**Flow:**

```
App Mount
  → SiteConfigProvider Load
  → SiteConfigAPI.getConfig()
  → GET /api/site-config
  → Database Query (site_config table)
  → JSONB Parse
  → Context State
  → All Components Access via useSiteConfig()
```

**Data Structure:**

```typescript
{
  headerImage: string,
  banners: string[],
  notices: NoticeItem[],
  navigation: NavItem[],
  footer: FooterConfig,
  baseStats: StatsConfig
}
```

**Key Features:**

- Auto-save (2s debounce)
- Real-time sync across components
- Fallback to default values
- JSONB storage in database

---

### 3. Projects Module

**Files:**

- `pages/Projects.tsx`
- `pages/ProjectDetail.tsx`
- `pages/Admin/ProjectManager.tsx`
- `server/index.ts` (routes: `/api/projects/*`)

**Database Schema:**

```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'fundraising',
    target_amount DECIMAL(12, 2),
    raised_amount DECIMAL(12, 2),
    donor_count INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    description TEXT,
    content TEXT,
    valid_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**CRUD Operations:**

- GET `/api/projects` - List all projects
- GET `/api/projects/:id` - Get single project
- POST `/api/projects` - Create project (Admin)
- PUT `/api/projects/:id` - Update project (Admin)
- DELETE `/api/projects/:id` - Delete project (Admin)

---

### 4. News Module

**Files:**

- `pages/NewsDetail.tsx`
- `pages/Admin/NewsManager.tsx` (if exists)
- `server/index.ts` (routes: `/api/news/*`)

**Categories:**

- `charity` - 慈善资讯
- `media` - 媒体报道
- `district` - 区县动态

**Features:**

- Category filtering
- Rich text content
- Image attachments
- View counter

---

### 5. Donations Module

**Files:**

- `pages/Admin/DonationManager.tsx`
- `components/Home/DonorList.tsx` (if exists)
- `server/index.ts` (routes: `/api/donations/*`)

**Flow:**

```
Donation Form
  → POST /api/donations
  → Database Transaction:
      1. INSERT INTO donations
      2. UPDATE projects.raised_amount
      3. UPDATE projects.donor_count
  → COMMIT
  → Success Response
```

---

## 🎨 UI Component Hierarchy

```
App.tsx
├─ AuthProvider
│  └─ DataProvider
│     └─ SiteConfigProvider
│        ├─ Router
│        │  ├─ PublicLayout
│        │  │  ├─ Header (uses SiteConfig)
│        │  │  ├─ <Page Content>
│        │  │  └─ Footer (uses SiteConfig)
│        │  │
│        │  └─ AdminLayout (Protected)
│        │     ├─ Sidebar
│        │     └─ Admin Pages
│        │        ├─ Dashboard
│        │        ├─ Settings (NavigationSettings + Auto-save)
│        │        ├─ ProjectManager
│        │        └─ DonationManager
│        │
│        └─ NavigationDebug (Dev only)
```

---

## 🔐 Security Architecture

### Authentication Layer

```
Request → Token Check → Verify Token → Route Handler
                 ↓
              Invalid
                 ↓
           401 Unauthorized
```

### Input Validation

- React Hook Form validation
- Backend schema validation
- SQL injection prevention (Parameterized queries)
- XSS protection (Content sanitization)

### Password Security

- bcrypt hashing (salt rounds: 10)
- No plaintext storage
- Secure comparison

### CORS Policy

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
```

---

## 📊 Database Design

### Key Tables

#### site_config (Key-Value Store)

```sql
CREATE TABLE site_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Usage:**

- Flexible schema-less storage
- Supports nested objects
- Fast JSON operations
- Easy versioning

#### projects (Core Entity)

```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'fundraising',
    target_amount DECIMAL(12, 2),
    raised_amount DECIMAL(12, 2),
    donor_count INTEGER DEFAULT 0,
    ...
);
```

**Indexes:**

```sql
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_status ON projects(status);
```

---

## 🚀 Performance Optimizations

### Frontend

1. **Code Splitting:** React.lazy() for large components
2. **Memoization:** React.memo() for expensive renders
3. **Context Optimization:** Separate contexts to prevent unnecessary re-renders
4. **Image Optimization:** Lazy loading, responsive images

### Backend

1. **Connection Pooling:** PostgreSQL connection pool
2. **Query Optimization:** Proper indexes on foreign keys
3. **Transaction Management:** BEGIN/COMMIT for data integrity
4. **Caching Strategy:** (Future: Redis for frequently accessed data)

### Database

1. **JSONB Indexing:** For site_config queries
2. **Foreign Key Indexes:** Fast joins
3. **Query Planning:** EXPLAIN ANALYZE for optimization

---

## 🧪 Testing Strategy

### Unit Tests (Future)

- Component tests with React Testing Library
- API service tests
- Utility function tests

### Integration Tests (Completed)

- Navigation sync E2E test ✅
- Auto-save feature test ✅
- Admin CRUD operations test ✅

### Manual Testing Checklist

- [x] User authentication flow
- [x] Admin panel functionality
- [x] Navigation sync
- [x] Auto-save feature
- [x] F5 data persistence
- [x] Responsive design
- [x] Cross-browser compatibility

---

## 📦 Deployment Architecture

### Development

```
Vite Dev Server (Port 5173) + Backend Server (Port 3001) + PostgreSQL
```

### Production (Future)

```
┌─────────────┐
│   Nginx     │ ← Reverse Proxy
└──────┬──────┘
       ├─ /api → Backend (Node.js)
       └─ /* → Static Files (React Build)

Database: PostgreSQL (Cloud/VPS)
Storage: S3/CloudFlare for images
```

---

## 🔧 Configuration Files

### `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    ...
  }
}
```

### `.env` (Example)

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=3001
NODE_ENV=production
```

---

## 📚 Technology Stack

### Frontend

- **Framework:** React 18.3
- **Build Tool:** Vite 5.x
- **Routing:** React Router 6.x
- **State Management:** React Context API
- **Forms:** React Hook Form
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **TypeScript:** 5.x

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Driver:** pg (node-postgres)
- **Auth:** bcryptjs
- **File Upload:** Multer
- **CORS:** cors middleware

### Database

- **RDBMS:** PostgreSQL 14+
- **ORM:** Raw SQL (for flexibility)
- **Storage:** JSONB for configuration

### DevOps (Future)

- **Container:** Docker
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (Frontend) + Railway/Render (Backend)

---

## 🔗 API Endpoints Reference

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verify token

### Projects

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### News

- `GET /api/news` - List all news
- `GET /api/news/:id` - Get news details
- `POST /api/news` - Create news (Admin)
- `PUT /api/news/:id` - Update news (Admin)
- `DELETE /api/news/:id` - Delete news (Admin)

### Site Configuration

- `GET /api/site-config` - Get site config
- `POST /api/site-config` - Update site config (Admin)

### Donations

- `GET /api/donations` - List donations
- `POST /api/donations` - Create donation
- `GET /api/stats/total-raised` - Get total raised amount

### Volunteers

- `GET /api/volunteers` - List volunteers
- `POST /api/volunteers` - Submit volunteer application
- `PUT /api/volunteers/:id/status` - Update volunteer status (Admin)
- `DELETE /api/volunteers/:id` - Delete volunteer (Admin)

### Utilities

- `POST /api/upload` - Upload file
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint

---

## 📖 Related Documentation

- [System Sync Report](./SYSTEM_SYNC_REPORT.md)
- [Backend API Documentation](./backend.md)
- [Navigation Sync Guide](../TEST_RESULTS_NAVIGATION.md)
- [Auto-Save Feature](../FEATURE_AUTO_SAVE_DATABASE.md)
- [Admin Guide](../ADMIN_GUIDE.md)

---

**Maintained by:** AI Assistant
**Last Review:** 2026-01-11
**Version:** 1.0.0
