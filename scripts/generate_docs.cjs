const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// --- DATA DEFINITIONS ---

// 1. API Endpoints
const apiEndpoints = [
    { method: 'POST', path: '/api/auth/register', description: 'Register a new user', body: '{ username, password }', response: '{ success, message, token, user }' },
    { method: 'POST', path: '/api/auth/login', description: 'Login user', body: '{ username, password }', response: '{ success, token, user }' },
    { method: 'GET', path: '/api/auth/verify', description: 'Verify JWT token', body: '-', response: '{ valid, user }' },
    { method: 'GET', path: '/api/projects', description: 'Get all projects', body: '-', response: '[Project]' },
    { method: 'GET', path: '/api/projects/:id', description: 'Get project by ID', body: '-', response: 'Project' },
    { method: 'POST', path: '/api/projects', description: 'Create new project', body: 'ProjectData', response: 'Project' },
    { method: 'PUT', path: '/api/projects/:id', description: 'Update project', body: 'ProjectData', response: 'Project' },
    { method: 'DELETE', path: '/api/projects/:id', description: 'Delete project', body: '-', response: '{ success, message }' },
    { method: 'GET', path: '/api/news', description: 'Get all news', body: '-', response: '[News]' },
    { method: 'POST', path: '/api/news', description: 'Create news item', body: 'NewsData', response: 'News' },
    { method: 'GET', path: '/api/donations', description: 'Get all donations', body: '-', response: '[Donation]' },
    { method: 'POST', path: '/api/donations', description: 'Create donation record', body: '{ donorName, amount, projectId, ... }', response: '{ success, id }' },
    { method: 'GET', path: '/api/volunteers', description: 'Get all volunteers', body: '-', response: '[Volunteer]' },
    { method: 'POST', path: '/api/volunteers', description: 'Register volunteer', body: 'VolunteerData', response: 'Volunteer' },
    { method: 'GET', path: '/api/stats/total-raised', description: 'Get total raised statistics', body: '-', response: '{ total: number }' }
];

// 2. Database Schema
const dbSchema = [
    { table: 'users', columns: 'id (PK), username, password_hash, role, created_at' },
    { table: 'site_config', columns: 'id (PK), key (UNIQUE), value (JSONB), updated_at' },
    { table: 'categories', columns: 'id (PK), name, slug (UNIQUE), type, sort_order' },
    { table: 'projects', columns: 'id (PK), category_id (FK), title, status, target_amount, raised_amount, donor_count, image_url, description, content, start_date, end_date, valid_date, created_at, updated_at' },
    { table: 'news', columns: 'id (PK), category_id (FK), title, summary, content, image_url, author, views, published_at, is_published' },
    { table: 'funds', columns: 'id (PK), name, image_url, total_amount, manager, description, created_at' },
    { table: 'volunteers', columns: 'id (PK), name, phone, email, status, skills, joined_at, hours_contributed' },
    { table: 'notices', columns: 'id (PK), content, type, link_url, is_active, created_at' },
    { table: 'banners', columns: 'id (PK), image_url, link_url, title, sort_order, is_active' },
    { table: 'donations', columns: 'id (PK), project_id (FK), fund_id (FK), donor_name, amount, message, payment_method, transaction_id, status, created_at' }
];

// 3. Project Structure
const projectStructure = [
    { path: 'server/index.ts', description: 'Main Express server file, API routes, Database connection' },
    { path: 'database/schema.sql', description: 'PostgreSQL database schema definition' },
    { path: 'database/seed.sql', description: 'Initial seed data for development' },
    { path: 'src/contexts/AuthContext.tsx', description: 'React Context for Authentication' },
    { path: 'src/services/api.ts', description: 'Frontend API service with adapters' },
    { path: 'src/pages/Admin/*', description: 'Admin panel components' },
    { path: 'src/components/Shared/*', description: 'Reusable UI components' }
];

// 4. Environment Variables
const envVars = [
    { name: 'PORT', description: 'Server port (default: 3001)' },
    { name: 'DATABASE_URL', description: 'PostgreSQL connection string' },
    { name: 'JWT_SECRET', description: 'Secret key for JWT signing' },
    { name: 'GEMINI_API_KEY', description: 'API Key for AI features (optional)' }
];

// --- GENERATE EXCEL ---

function generateExcel() {
    const wb = XLSX.utils.book_new();

    // 1. API Sheet
    const wsAPI = XLSX.utils.json_to_sheet(apiEndpoints);
    XLSX.utils.book_append_sheet(wb, wsAPI, "API Endpoints");

    // 2. DB Sheet
    const wsDB = XLSX.utils.json_to_sheet(dbSchema);
    XLSX.utils.book_append_sheet(wb, wsDB, "Database Schema");

    // 3. Structure Sheet
    const wsStruct = XLSX.utils.json_to_sheet(projectStructure);
    XLSX.utils.book_append_sheet(wb, wsStruct, "Project Structure");

    // 4. Env Sheet
    const wsEnv = XLSX.utils.json_to_sheet(envVars);
    XLSX.utils.book_append_sheet(wb, wsEnv, "Env Variables");

    // Write file
    const filePath = path.join('d:', 'Tool', 'TOOL', 'dandan', 'docs', 'System_Documentation.xlsx');
    
    // Ensure docs dir exists
    const docsDir = path.dirname(filePath);
    if (!fs.existsSync(docsDir)){
        fs.mkdirSync(docsDir, { recursive: true });
    }

    try {
        XLSX.writeFile(wb, filePath);
        console.log(`Successfully created System_Documentation.xlsx at ${filePath}`);
    } catch (error) {
        console.error("Error writing Excel file:", error);
    }
}

generateExcel();
