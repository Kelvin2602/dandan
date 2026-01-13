
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_FILE = path.join(DOCS_DIR, 'System_Documentation.xlsx');

// 1. Prepare Data for Sheet 1 (Overview) - Reading from existing CSV or defaults
const sheet1Data = [
    { Feature: 'Homepage', Status: 'Verified', Notes: 'Displays dynamic content from DB' },
    { Feature: 'Project List', Status: 'Verified', Notes: 'Fetches & filters active projects' },
    { Feature: 'Project Detail', Status: 'Verified', Notes: 'Shows details & donation form' },
    { Feature: 'News List', Status: 'Verified', Notes: 'Fetches news items' },
    { Feature: 'News Detail', Status: 'Verified', Notes: 'Shows content' },
    { Feature: 'Donation Flow', Status: 'Verified', Notes: 'Frontend form works (API connects)' },
    { Feature: 'Volunteer Signup', Status: 'Verified', Notes: 'Submits to DB' },
    { Feature: 'Admin Login', Status: 'Verified', Notes: 'Auth API & UI ready (admin/123456)' },
    { Feature: 'Admin Dashboard', Status: 'Verified', Notes: 'Stats overview' },
    { Feature: 'Project Mgmt', Status: 'Verified', Notes: 'CRUD + Search + Image Upload' },
    { Feature: 'News Mgmt', Status: 'Verified', Notes: 'CRUD + Search + Image Upload' },
    { Feature: 'Donation Mgmt', Status: 'Verified', Notes: 'List + Export + Manual Add' },
    { Feature: 'Volunteer Mgmt', Status: 'Verified', Notes: 'List + Approve/Reject + Export' },
    { Feature: 'Site Settings', Status: 'Verified', Notes: 'Configurable Header/Footer/Banners/Notices' },
    { Feature: 'File Upload', Status: 'Verified', Notes: 'Multer + /api/upload endpoint' },
    { Feature: 'Database', Status: 'Verified', Notes: 'Schema migrated, seed data active' },
    { Feature: 'Mobile Responsive', Status: 'Verified', Notes: 'Tailwind classes used throughout' }
];

// 2. Prepare Data for Sheet 2 (Admin Admin Functions & APIs)
const sheet2Data = [
    { Category: 'Auth', Page: 'Login', Functionality: 'Admin Login', Frontend_Method: 'AuthAPI.login', API_Endpoint: '/api/auth/login', HTTP_Method: 'POST', Status: 'Verified' },
    
    { Category: 'Dashboard', Page: 'Dashboard', Functionality: 'Load Statistics', Frontend_Method: 'DonationsAPI.getTotalRaised', API_Endpoint: '/api/stats/total-raised', HTTP_Method: 'GET', Status: 'Verified' },

    { Category: 'Project Mgmt', Page: 'ProjectManager', Functionality: 'List Projects', Frontend_Method: 'ProjectsAPI.getAll', API_Endpoint: '/api/projects', HTTP_Method: 'GET', Status: 'Verified' },
    { Category: 'Project Mgmt', Page: 'ProjectManager', Functionality: 'Create Project', Frontend_Method: 'ProjectsAPI.create', API_Endpoint: '/api/projects', HTTP_Method: 'POST', Status: 'Verified' },
    { Category: 'Project Mgmt', Page: 'ProjectManager', Functionality: 'Update Project', Frontend_Method: 'ProjectsAPI.update', API_Endpoint: '/api/projects/:id', HTTP_Method: 'PUT', Status: 'Verified' },
    { Category: 'Project Mgmt', Page: 'ProjectManager', Functionality: 'Delete Project', Frontend_Method: 'ProjectsAPI.delete', API_Endpoint: '/api/projects/:id', HTTP_Method: 'DELETE', Status: 'Verified' },
    { Category: 'Project Mgmt', Page: 'ProjectManager', Functionality: 'Upload Image', Frontend_Method: 'ImageUpload', API_Endpoint: '/api/upload', HTTP_Method: 'POST', Status: 'Verified' },

    { Category: 'News Mgmt', Page: 'NewsManager', Functionality: 'List News', Frontend_Method: 'NewsAPI.getAll', API_Endpoint: '/api/news', HTTP_Method: 'GET', Status: 'Verified' },
    { Category: 'News Mgmt', Page: 'NewsManager', Functionality: 'Create News', Frontend_Method: 'NewsAPI.create', API_Endpoint: '/api/news', HTTP_Method: 'POST', Status: 'Verified' },
    { Category: 'News Mgmt', Page: 'NewsManager', Functionality: 'Update News', Frontend_Method: 'NewsAPI.update', API_Endpoint: '/api/news/:id', HTTP_Method: 'PUT', Status: 'Verified' },
    { Category: 'News Mgmt', Page: 'NewsManager', Functionality: 'Delete News', Frontend_Method: 'NewsAPI.delete', API_Endpoint: '/api/news/:id', HTTP_Method: 'DELETE', Status: 'Verified' },

    { Category: 'Donation Mgmt', Page: 'DonationManager', Functionality: 'List Donations', Frontend_Method: 'DonationsAPI.getAll', API_Endpoint: '/api/donations', HTTP_Method: 'GET', Status: 'Verified' },
    { Category: 'Donation Mgmt', Page: 'DonationManager', Functionality: 'Manual Add Donation', Frontend_Method: 'DonationsAPI.create', API_Endpoint: '/api/donations', HTTP_Method: 'POST', Status: 'Verified' },
    { Category: 'Donation Mgmt', Page: 'DonationManager', Functionality: 'Export to Excel', Frontend_Method: 'ExportService.exportToExcel', API_Endpoint: 'N/A', HTTP_Method: 'Client', Status: 'Verified' },

    { Category: 'Volunteer Mgmt', Page: 'VolunteerManager', Functionality: 'List Applications', Frontend_Method: 'VolunteersAPI.getAll', API_Endpoint: '/api/volunteers', HTTP_Method: 'GET', Status: 'Verified' },
    { Category: 'Volunteer Mgmt', Page: 'VolunteerManager', Functionality: 'Update Status', Frontend_Method: 'VolunteersAPI.updateStatus', API_Endpoint: '/api/volunteers/:id/status', HTTP_Method: 'PUT', Status: 'Verified' },
    { Category: 'Volunteer Mgmt', Page: 'VolunteerManager', Functionality: 'Export to Excel', Frontend_Method: 'ExportService.exportToExcel', API_Endpoint: 'N/A', HTTP_Method: 'Client', Status: 'Verified' },

    { Category: 'Settings', Page: 'Settings', Functionality: 'Load Config', Frontend_Method: 'SiteConfigAPI.getConfig', API_Endpoint: '/api/site-config', HTTP_Method: 'GET', Status: 'Verified' },
    { Category: 'Settings', Page: 'Settings', Functionality: 'Save Config (Header/Footer)', Frontend_Method: 'SiteConfigAPI.updateConfig', API_Endpoint: '/api/site-config', HTTP_Method: 'POST', Status: 'Verified' },
    { Category: 'Settings', Page: 'Settings', Functionality: 'Manage Banners', Frontend_Method: 'SiteConfigAPI.updateConfig', API_Endpoint: '/api/site-config', HTTP_Method: 'POST', Status: 'Verified' },
    { Category: 'Settings', Page: 'Settings', Functionality: 'Manage Notices', Frontend_Method: 'SiteConfigAPI.updateConfig', API_Endpoint: '/api/site-config', HTTP_Method: 'POST', Status: 'Verified' }
];

// 3. Prepare Data for Sheet 3 (Client Functions & APIs)
const sheet3Data = [
    { Page: 'Home', Component: 'HomeBanner', Functionality: 'Fetch Banners', Frontend_Method: 'useSiteConfig (SiteConfigAPI.getConfig)', API_Endpoint: '/api/site-config', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'Home', Component: 'NoticeBar', Functionality: 'Fetch Active Notices', Frontend_Method: 'NoticesAPI.getActive', API_Endpoint: '/api/notices/active', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'Home', Component: 'StatsGrid', Functionality: 'Load Total Raised', Frontend_Method: 'DonationsAPI.getTotalRaised', API_Endpoint: '/api/stats/total-raised', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'Home', Component: 'Home (Main)', Functionality: 'Fetch Projects', Frontend_Method: 'ProjectsAPI.getAll', API_Endpoint: '/api/projects', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'Home', Component: 'Home (Main)', Functionality: 'Fetch News', Frontend_Method: 'NewsAPI.getAll', API_Endpoint: '/api/news', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'Home', Component: 'Home (Main)', Functionality: 'Fetch Funds', Frontend_Method: 'FundsAPI.getAll', API_Endpoint: '/api/funds', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'Home', Component: 'DonationTable', Functionality: 'Fetch Recent Donations', Frontend_Method: 'DonationsAPI.getAll', API_Endpoint: '/api/donations', HTTP_Method: 'GET', Status: 'Verified' },

    { Page: 'Projects', Component: 'Projects', Functionality: 'List All Projects', Frontend_Method: 'ProjectsAPI.getAll', API_Endpoint: '/api/projects', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'ProjectDetail', Component: 'ProjectDetail', Functionality: 'Get Project Details', Frontend_Method: 'ProjectsAPI.getById', API_Endpoint: '/api/projects/:id', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'ProjectDetail', Component: 'ProjectDetail', Functionality: 'Submit Donation', Frontend_Method: 'DonationsAPI.create', API_Endpoint: '/api/donations', HTTP_Method: 'POST', Status: 'Verified' },

    { Page: 'News', Component: 'NewsList', Functionality: 'List News Items', Frontend_Method: 'NewsAPI.getAll', API_Endpoint: '/api/news', HTTP_Method: 'GET', Status: 'Verified' },
    { Page: 'NewsDetail', Component: 'NewsDetail', Functionality: 'Get News Content', Frontend_Method: 'NewsAPI.getById', API_Endpoint: '/api/news/:id', HTTP_Method: 'GET', Status: 'Verified' },

    { Page: 'Funds', Component: 'FundsList', Functionality: 'List Funds', Frontend_Method: 'FundsAPI.getAll', API_Endpoint: '/api/funds', HTTP_Method: 'GET', Status: 'Verified' },

    { Page: 'Volunteer', Component: 'Volunteer', Functionality: 'Submit Application', Frontend_Method: 'VolunteersAPI.create', API_Endpoint: '/api/volunteers', HTTP_Method: 'POST', Status: 'Verified' },

    { Page: 'Info', Component: 'TransactionList', Functionality: 'List Public Donations', Frontend_Method: 'DonationsAPI.getAll', API_Endpoint: '/api/donations', HTTP_Method: 'GET', Status: 'Verified' },

    { Page: 'Global', Component: 'Header/Footer', Functionality: 'Load Site Info', Frontend_Method: 'SiteConfigAPI.getConfig', API_Endpoint: '/api/site-config', HTTP_Method: 'GET', Status: 'Verified' },
    
    { Page: 'Global', Component: 'TopBar (Header)', Functionality: 'Member Login', Frontend_Method: 'Link to /login', API_Endpoint: 'N/A', HTTP_Method: 'N/A', Status: 'Pending Implementation (Route missing)' },
    { Page: 'Global', Component: 'TopBar (Header)', Functionality: 'Member Registration', Frontend_Method: 'Button Click', API_Endpoint: 'N/A', HTTP_Method: 'N/A', Status: 'Pending Implementation (No logic)' }
];

// 4. Create Workbook and Sheets
const wb = xlsx.utils.book_new();

const ws1 = xlsx.utils.json_to_sheet(sheet1Data);
xlsx.utils.book_append_sheet(wb, ws1, "Functionality Overview");

const ws2 = xlsx.utils.json_to_sheet(sheet2Data);
ws2['!cols'] = [
    { wch: 15 }, // Category
    { wch: 20 }, // Page
    { wch: 20 }, // Functionality
    { wch: 25 }, // Frontend Method
    { wch: 25 }, // API Endpoint
    { wch: 10 }, // HTTP Method
    { wch: 10 }  // Status
];
xlsx.utils.book_append_sheet(wb, ws2, "Admin Functions & APIs");

const ws3 = xlsx.utils.json_to_sheet(sheet3Data);
ws3['!cols'] = [
    { wch: 15 }, // Page
    { wch: 20 }, // Component
    { wch: 25 }, // Functionality
    { wch: 30 }, // Frontend Method
    { wch: 25 }, // API Endpoint
    { wch: 10 }, // HTTP Method
    { wch: 10 }  // Status
];
xlsx.utils.book_append_sheet(wb, ws3, "Client Functions & APIs");

// 4. Write File
xlsx.writeFile(wb, OUTPUT_FILE);

console.log(`Successfully created Excel file at: ${OUTPUT_FILE}`);
