---
inclusion: always
---
# Database Architecture & Standards

## Database Technology
- **PostgreSQL**: Production database với Neon serverless hosting
- **Connection**: pg library với connection pooling
- **SSL**: Required với rejectUnauthorized: false cho Neon

## Schema Structure

### Core Tables
```sql
-- Configuration & Content Management
site_config     # Website configuration (JSON storage)
categories      # Content categorization (news, projects)
banners         # Homepage carousel images
notices         # Announcement bar messages

-- Main Content
projects        # Charity projects với fundraising data
news           # News articles với category classification
funds          # Charity funds management
users          # Authentication (admin/public users)

-- User Interactions
volunteers     # Volunteer applications và status tracking
donations      # Donation records với project linking
```

### Key Relationships
- `projects.category_id → categories.id` (Project categorization)
- `news.category_id → categories.id` (News categorization)
- `donations.project_id → projects.id` (Donation tracking)

## Data Types & Conventions

### Naming Convention
- **Tables**: snake_case (e.g., `site_config`, `admin_users`)
- **Columns**: snake_case (e.g., `image_url`, `created_at`)
- **Primary Keys**: SERIAL PRIMARY KEY
- **Foreign Keys**: `table_id` format

### Standard Columns
```sql
-- Timestamps
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

-- Status fields
is_active BOOLEAN DEFAULT true
status VARCHAR(20) DEFAULT 'pending'

-- Amounts (financial)
DECIMAL(12, 2) -- Supports up to 999,999,999,999.99
```

### Frontend-Database Mapping
```typescript
// TypeScript Interface → Database Column
Project.image → projects.image_url
Project.raised → projects.raised_amount
Project.target → projects.target_amount
Project.donors → projects.donor_count
Project.validDate → projects.valid_date
```

## Migration & Seeding

### Migration Process
```bash
# Run schema migration
npm run migrate
# Or manually: tsx database/migrate.ts
```

### Seed Data Structure
- **Projects**: 4 sample charity projects với realistic data
- **News**: 5 news articles across categories (charity, media, district)
- **Funds**: 4 charity funds với different sponsors
- **Donations**: Sample donation records
- **Site Config**: Header images, banners, footer info
- **Admin User**: Default admin/admin credentials

## Query Patterns

### JOIN Queries
```sql
-- Projects với category names
SELECT p.*, c.name as category 
FROM projects p 
LEFT JOIN categories c ON p.category_id = c.id

-- News với category classification
SELECT n.*, c.name as category 
FROM news n 
LEFT JOIN categories c ON n.category_id = c.id
```

### Aggregation Queries
```sql
-- Total donations raised
SELECT COALESCE(SUM(amount), 0) as total FROM donations

-- Project statistics update
UPDATE projects 
SET raised_amount = raised_amount + $1, donor_count = donor_count + 1 
WHERE id = $2
```

## Security & Performance

### SQL Injection Prevention
- **Parameterized Queries**: Always use $1, $2, $3 placeholders
- **Input Validation**: Validate all user inputs before database operations
- **Type Safety**: Use TypeScript interfaces for query results

### Transaction Management
```sql
-- Complex operations
BEGIN;
-- Multiple related operations
COMMIT; -- or ROLLBACK on error
```

### Indexing Strategy
```sql
-- Performance indexes
CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_donations_project ON donations(project_id);
```

## Development Guidelines
1. **Schema Changes**: Always update schema.sql và create migration scripts
2. **Seed Data**: Keep seed.sql updated với realistic test data
3. **Backup Strategy**: Regular backups của production data
4. **Environment Variables**: Use DATABASE_URL cho connection string
5. **Error Handling**: Proper error logging cho database operations