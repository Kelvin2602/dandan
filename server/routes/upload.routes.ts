import { Request, Response, Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// ESM fix for __dirname in this module if needed, but path.resolve is better relative to CWD or just use hardcoded relative path
// However, multer destination needs absolute or relative path. 
// We generally want to store in project_root/uploads.
// ../../uploads relative to server/routes/upload.routes.ts would be project_root/server/uploads if routes is server/routes
// The original code used `path.join(__dirname, '../uploads')` from `server/index.ts`.
// `server/index.ts` is in `d:\Tool\TOOL\dandan\server`. So `../uploads` is `d:\Tool\TOOL\dandan\uploads`.
// Here we are in `d:\Tool\TOOL\dandan\server\routes`. So we need `../../uploads`.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
