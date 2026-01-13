const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ==========================================
// 1. DATA PREPARATION
// ==========================================

// --- BACKEND DATA ---
const apiEndpoints = [
    { module: 'Auth', method: 'POST', path: '/api/auth/register', description: 'Register new user', input: '{ username, password }', output: '{ success, message, token, user }' },
    { module: 'Auth', method: 'POST', path: '/api/auth/login', description: 'Login user', input: '{ username, password }', output: '{ success, token, user }' },
    { module: 'Auth', method: 'GET', path: '/api/auth/verify', description: 'Validate JWT', input: 'Header: Authorization', output: '{ valid, user }' },
    
    { module: 'Projects', method: 'GET', path: '/api/projects', description: 'List all projects', input: '-', output: '[Project]' },
    { module: 'Projects', method: 'POST', path: '/api/projects', description: 'Create project', input: 'ProjectData', output: 'Project' },
    { module: 'Projects', method: 'PUT', path: '/api/projects/:id', description: 'Update project', input: 'ProjectData', output: 'Project' },
    { module: 'Projects', method: 'DELETE', path: '/api/projects/:id', description: 'Delete project', input: '-', output: '{ success }' },

    { module: 'Donations', method: 'GET', path: '/api/donations', description: 'List donations', input: '-', output: '[Donation]' },
    { module: 'Donations', method: 'POST', path: '/api/donations', description: 'Add donation', input: '{ donorName, amount... }', output: '{ success, id }' },
    
    { module: 'News', method: 'GET', path: '/api/news', description: 'List news', input: '-', output: '[News]' },
    { module: 'Volunteers', method: 'GET', path: '/api/volunteers', description: 'List volunteers', input: '-', output: '[Volunteer]' },
    { module: 'Funds', method: 'GET', path: '/api/funds', description: 'List funds', input: '-', output: '[Fund]' }
];

const dbSchema = [
    { table: 'users', description: 'Admin users', columns: 'id, username, password_hash, role' },
    { table: 'projects', description: 'Charity projects', columns: 'id, title, status, target_amount, raised_amount, description...' },
    { table: 'donations', description: 'Donation records', columns: 'id, project_id, donor_name, amount, payment_method...' },
    { table: 'news', description: 'News articles', columns: 'id, title, category_id, content, is_published...' },
    { table: 'volunteers', description: 'Volunteer applications', columns: 'id, name, status, skills...' },
    { table: 'site_config', description: 'Dynamic site settings', columns: 'key, value (JSON)' }
];

// --- FRONTEND DATA ---
const appRoutes = [
    { type: 'Public', path: '/', component: 'Home', description: 'Landing page' },
    { type: 'Public', path: '/projects', component: 'Projects', description: 'Project list grid' },
    { type: 'Public', path: '/projects/:id', component: 'ProjectDetail', description: 'Project details & donation' },
    { type: 'Public', path: '/news', component: 'NewsList', description: 'News archive' },
    { type: 'Public', path: '/funds', component: 'FundsList', description: 'Fund disclosure' },
    { type: 'Public', path: '/volunteer', component: 'Volunteer', description: 'Volunteer application form' },
    { type: 'Auth', path: '/admin/login', component: 'AdminLogin', description: 'Admin portal login' },
    { type: 'Admin', path: '/admin', component: 'AdminDashboard', description: 'Overview stats' },
    { type: 'Admin', path: '/admin/projects', component: 'AdminProjectManager', description: 'CRUD Projects' },
    { type: 'Admin', path: '/admin/donations', component: 'AdminDonationManager', description: 'View & add donations' },
    { type: 'Admin', path: '/admin/news', component: 'AdminNewsManager', description: 'Manage articles' },
    { type: 'Admin', path: '/admin/settings', component: 'AdminSettings', description: 'Site configuration' }
];

const frontendArchitecture = [
    { category: 'Context', name: 'AuthProvider', description: 'Manages user session, login/logout logic', file: 'contexts/AuthContext.tsx' },
    { category: 'Context', name: 'DataProvider', description: 'Global data store (Projects, News, Donations) with CRUD methods', file: 'contexts/DataContext.tsx' },
    { category: 'Context', name: 'SiteConfigProvider', description: 'Provides dynamic header/footer content', file: 'contexts/SiteConfigContext.tsx' },
    { category: 'Service', name: 'fetchAPI', description: 'Centralized fetch wrapper with error handling', file: 'services/api.ts' },
    { category: 'Component', name: 'ProtectedRoute', description: 'Guards admin routes, checks auth status', file: 'App.tsx' },
    { category: 'Component', name: 'AdminLayout', description: 'Sidebar + Header layout for admin pages', file: 'components/Layout/AdminLayout.tsx' }
];

const techStack = [
    { layer: 'Frontend', technology: 'React 18', notes: 'UI Library' },
    { layer: 'Frontend', technology: 'Vite', notes: 'Build Tool' },
    { layer: 'Frontend', technology: 'Tailwind CSS v4', notes: 'Styling' },
    { layer: 'Frontend', technology: 'React Router v6', notes: 'Routing' },
    { layer: 'Frontend', technology: 'React Hook Form', notes: 'Form Validation' },
    { layer: 'Backend', technology: 'Node.js + Express', notes: 'API Server' },
    { layer: 'Backend', technology: 'PostgreSQL', notes: 'Database' },
    { layer: 'Backend', technology: 'node-pg', notes: 'DB Driver' }
];

// ==========================================
// 2. EXCEL GENERATION
// ==========================================

function generateExcel() {
    console.log("Generating System Documentation...");
    const wb = XLSX.utils.book_new();

    // Sheet 1: Overview & Stack
    const wsStack = XLSX.utils.json_to_sheet(techStack);
    XLSX.utils.book_append_sheet(wb, wsStack, "Tech Stack");

    // Sheet 2: Frontend Routes
    const wsRoutes = XLSX.utils.json_to_sheet(appRoutes);
    XLSX.utils.book_append_sheet(wb, wsRoutes, "Frontend Routes");

    // Sheet 3: Frontend Architecture
    const wsArch = XLSX.utils.json_to_sheet(frontendArchitecture);
    XLSX.utils.book_append_sheet(wb, wsArch, "Frontend Architecture");

    // Sheet 4: Backend API
    const wsAPI = XLSX.utils.json_to_sheet(apiEndpoints);
    XLSX.utils.book_append_sheet(wb, wsAPI, "Backend API");

    // Sheet 5: Database
    const wsDB = XLSX.utils.json_to_sheet(dbSchema);
    XLSX.utils.book_append_sheet(wb, wsDB, "Database Schema");

    // Write file
    const filePath = path.join('d:', 'Tool', 'TOOL', 'dandan', 'docs', 'System_Documentation.xlsx');
    
    // Ensure docs dir exists
    const docsDir = path.dirname(filePath);
    if (!fs.existsSync(docsDir)){
        fs.mkdirSync(docsDir, { recursive: true });
    }

    try {
        XLSX.writeFile(wb, filePath);
        console.log(`SUCCESS: Created documentation at ${filePath}`);
    } catch (error) {
        console.error("ERROR: Failed to write Excel file:", error);
    }
}

generateExcel();
