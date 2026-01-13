import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db';

// Routes
import authRoutes from './routes/auth.routes';
import commonRoutes from './routes/common.routes';
import donationRoutes from './routes/donation.routes';
import fundRoutes from './routes/fund.routes';
import newsRoutes from './routes/news.routes';
import noticeRoutes from './routes/notice.routes';
import projectRoutes from './routes/project.routes';
import siteConfigRoutes from './routes/siteConfig.routes';
import uploadRoutes from './routes/upload.routes';
import volunteerRoutes from './routes/volunteer.routes';

// Load environment variables
dotenv.config();

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url} from ${req.ip}`);
  next();
});
// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database Connection
connectDB();

// --- API ROUTES ---

// Core & Common (Health, Stats, content-independent)
app.use('/api', commonRoutes);

// Auth
app.use('/api/auth', authRoutes);

// Modules
app.use('/api/projects', projectRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/site-config', siteConfigRoutes);
app.use('/api/upload', uploadRoutes);

// Start Server
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

server.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Please free up the port or use a different one.`
    );
    process.exit(1);
  } else {
    console.error(e);
  }
});
