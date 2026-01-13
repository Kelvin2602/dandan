---
inclusion: always
---
# Backend Architecture & Standards

## Server Technology
- **Express.js 5.2.1**: RESTful API server
- **TypeScript**: Full type safety với ES2022 target
- **Port**: 3001 (development), configurable via PORT env
- **CORS**: Enabled cho cross-origin requests

## Middleware Stack
```typescript
// Core middleware
app.use(cors());                    // Cross-origin requests
app.use(express.json());            // JSON body parsing
app.use('/uploads', express.static(...)); // Static file serving
```

## File Upload System
- **Multer**: Disk storage trong `/uploads` directory
- **Naming**: Timestamp + random suffix + original extension
- **Security**: File type validation, size limits
- **Response**: `{ url: string }` với full URL path

## Authentication System

### JWT-like Token System
```typescript
// Simple token generation
const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

// Password hashing
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, user.password_hash);
```

### Admin Access Control
- **Default Admin**: username: `admin`, password: `admin`
- **Role-based**: `admin` role cho full access
- **Token Storage**: localStorage trên client side

## API Endpoint Structure

### RESTful Conventions
```typescript
// Standard CRUD pattern
GET    /api/resource     # List all
GET    /api/resource/:id # Get by ID
POST   /api/resource     # Create new
PUT    /api/resource/:id # Update existing
DELETE /api/resource/:id # Delete
```

### Specialized Endpoints
```typescript
// Statistics
GET /api/stats/total-raised

// Status updates
PUT /api/volunteers/:id/status

// File upload
POST /api/upload

// Authentication
POST /api/auth/login
POST /api/auth/register
```

## Database Integration

### Connection Pool
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### Query Patterns
```typescript
// Parameterized queries
const result = await pool.query(
  'SELECT * FROM projects WHERE id = $1', 
  [projectId]
);

// Transaction handling
await client.query('BEGIN');
try {
  // Multiple operations
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
}
```

## Error Handling Standards

### Consistent Error Responses
```typescript
// Standard error format
{
  error: string,      // Human-readable message
  status?: number,    // HTTP status code
  code?: string      // Error code for client handling
}
```

### HTTP Status Codes
- **200**: Success với data
- **201**: Created successfully
- **400**: Bad request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Resource not found
- **409**: Conflict (duplicate data)
- **500**: Internal server error

## Data Transformation

### Database → Frontend Mapping
```typescript
// Column name transformation
SELECT 
  p.image_url as "image",
  p.raised_amount as "raised",
  p.target_amount as "target",
  p.donor_count as "donors",
  c.name as "category"
FROM projects p
LEFT JOIN categories c ON p.category_id = c.id
```

### Response Formatting
```typescript
// Consistent success responses
res.json(data);                    // Direct data
res.json({ success: true, id });   // Operation confirmation
res.status(201).json(newRecord);   // Created resource
```

## Business Logic Patterns

### Donation Processing
```typescript
// 1. Insert donation record
// 2. Update project statistics (raised_amount, donor_count)
// 3. Return success confirmation
```

### File Upload Flow
```typescript
// 1. Validate file type và size
// 2. Generate unique filename
// 3. Save to /uploads directory
// 4. Return full URL path
```

## Environment Configuration
```bash
# Required environment variables
DATABASE_URL=postgresql://...     # Neon database connection
PORT=3001                        # Server port (optional)
NODE_ENV=development             # Environment mode
```

## Development Guidelines
1. **Type Safety**: Use TypeScript interfaces cho all request/response data
2. **Error Logging**: Console.error cho server-side errors
3. **Input Validation**: Validate all user inputs before processing
4. **SQL Security**: Always use parameterized queries
5. **Transaction Safety**: Use BEGIN/COMMIT/ROLLBACK cho complex operations
6. **Response Consistency**: Maintain consistent JSON response formats