---
inclusion: always
---

# API Architecture & Standards

## Backend Architecture

- **Express.js Server**: RESTful API server (port 3001)
- **PostgreSQL Database**: Production database với Neon serverless
- **Authentication**: JWT-based với bcrypt password hashing
- **File Upload**: Multer middleware cho image uploads
- **CORS**: Enabled cho cross-origin requests

## API Base URL

```
Development: http://localhost:3001/api
Production: [Netlify Functions hoặc deployed server]
```

## Authentication Flow

```typescript
// Login Request
POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string, user: { username: string, role: string } }

// Register Request
POST /api/auth/register
Body: { username: string, password: string }
Response: { message: string, user: { username: string, role: string } }

// Verify Token Request
POST /api/auth/verify
Body: { token: string }
Response: { valid: boolean, user?: { username: string, role: string } }
```

## API Endpoints Structure

### Projects API (`/api/projects`)

- `GET /` - Lấy tất cả projects với category join
- `GET /:id` - Lấy project theo ID
- `POST /` - Tạo project mới (Admin only)
- `PUT /:id` - Cập nhật project (Admin only)
- `DELETE /:id` - Xóa project (Admin only)

### News API (`/api/news`)

- `GET /` - Lấy tất cả news với category join
- `GET /:id` - Lấy news theo ID
- `POST /` - Tạo news mới (Admin only)
- `PUT /:id` - Cập nhật news (Admin only)
- `DELETE /:id` - Xóa news (Admin only)

### Donations API (`/api/donations`)

- `GET /` - Lấy danh sách donations (limit 100)
- `POST /` - Tạo donation mới (Public)
- `GET /stats/total-raised` - Tổng số tiền quyên góp

### Volunteers API (`/api/volunteers`)

- `GET /` - Lấy danh sách volunteers (Admin only)
- `POST /` - Đăng ký volunteer (Public)
- `PUT /:id/status` - Cập nhật trạng thái volunteer (Admin only)
- `DELETE /:id` - Xóa volunteer (Admin only)

### Site Config API (`/api/site-config`)

- `GET /` - Lấy cấu hình website
- `POST /` - Cập nhật cấu hình (Admin only)

## Error Handling Standards

```typescript
// Consistent error response format
{
  error: string,           // Error message
  status?: number,         // HTTP status code
  code?: string           // Error code for client handling
}
```

## Data Validation Rules

- **Required Fields**: Validate tất cả required fields trước khi insert/update
- **Type Safety**: Sử dụng TypeScript interfaces từ `types.ts`
- **SQL Injection**: Sử dụng parameterized queries ($1, $2, etc.)
- **Input Sanitization**: Validate và sanitize user inputs

## Database Schema Mapping

```typescript
// Frontend Type → Database Column mapping
Project.image → projects.image_url
Project.raised → projects.raised_amount
Project.target → projects.target_amount
Project.donors → projects.donor_count
Project.validDate → projects.valid_date
Project.category → categories.name (JOIN)
```

## File Upload Standards

- **Endpoint**: `POST /api/upload`
- **Storage**: Local filesystem (`/uploads` directory)
- **Response**: `{ url: string }` - Full URL to uploaded file
- **Security**: File type validation, size limits

## API Client Standards

```typescript
// Centralized error handling trong fetchAPI helper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Consistent error handling
  // JSON response parsing
  // Base URL management
}

// Organized API modules
export const ProjectsAPI = { getAll, getById, create, update, delete };
export const AuthAPI = { login, register, verifyToken };
// etc...
```

## Development Guidelines

1. **Consistent Naming**: camelCase cho frontend, snake_case cho database
2. **Error Logging**: Console.error cho server errors
3. **Response Format**: Consistent JSON structure
4. **Status Codes**: Proper HTTP status codes (200, 201, 400, 401, 404, 500)
5. **Database Transactions**: Sử dụng BEGIN/COMMIT/ROLLBACK cho complex operations
