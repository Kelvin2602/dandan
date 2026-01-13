# Project Structure & Organization

## Root Structure

```
/
├── .kiro/              # Kiro IDE configuration
├── components/         # Reusable UI components
├── contexts/          # React Context providers
├── database/          # PostgreSQL schema và migration scripts
├── docs/              # Technical documentation
├── pages/             # Route components (Public + Admin)
├── server/            # Express.js backend server
├── services/          # API client và business logic
├── App.tsx            # Main app với routing setup
├── index.tsx          # Entry point
├── types.ts           # Global TypeScript interfaces
└── vite.config.ts     # Build configuration
```

## Component Organization

### `/components/`

- **Layout/**: Header, Footer, AdminLayout - layout components
- **Home/**: DonationTable, HomeBanner, NoticeBar, StatsGrid - trang chủ specific
- **Admin/**: ProjectForm - admin-specific components
- **Shared/**: Card, SEO, Loading - components tái sử dụng

### `/pages/`

- **Root level**: Public pages (Home, Projects, About, etc.)
- **Admin/**: Protected admin pages (Dashboard, ProjectManager, etc.)

### `/contexts/`

- **AuthContext**: Authentication state và login logic
- **DataContext**: CRUD operations cho projects, donations, volunteers
- **SiteConfigContext**: Website configuration settings

### `/database/`

- **schema.sql**: PostgreSQL database schema
- **migrate.ts**: Database migration utilities
- **seed.sql**: Initial data seeding

### `/server/`

- **index.ts**: Express.js API server với all endpoints

### `/services/`

- **api.ts**: Centralized API client với typed endpoints
- **apiClient.ts**: HTTP client utilities

## Naming Conventions

- **Files**: PascalCase cho components (e.g., `ProjectDetail.tsx`)
- **Folders**: PascalCase cho feature folders (e.g., `components/Home/`)
- **Types**: PascalCase interfaces trong `types.ts`
- **Context**: Suffix với "Context" (e.g., `DataContext`)
- **API**: Suffix với "API" (e.g., `ProjectsAPI`)

## Architecture Patterns

### Routing Structure

- **Public Routes**: Wrapped trong PublicLayout (Header + Footer)
- **Admin Routes**: Protected với ProtectedRoute + AdminLayout
- **Lazy Loading**: Tất cả pages sử dụng React.lazy()

### State Management

- **Global State**: React Context API cho shared data
- **Local State**: useState cho component-specific state
- **Persistence**: PostgreSQL database với API integration

### Data Flow

1. User interaction → Component
2. Component → Context method
3. Context → API call (services/api.ts)
4. API → Database operation (server/index.ts)
5. Response → Context update → Re-render

## File Responsibilities

- **App.tsx**: Routing, layout logic, providers setup
- **types.ts**: Centralized TypeScript definitions
- **services/api.ts**: API client với typed endpoints
- **contexts/**: Business logic và state management
- **server/index.ts**: Backend API endpoints và database operations
