# 🚀 Hướng Dẫn Deploy Lên Netlify

## 📋 Yêu Cầu Trước Khi Deploy

1. ✅ Code đã được commit và push lên GitHub
2. ✅ Repository: https://github.com/tungvu82nt/dandan.git
3. ✅ Branch: `main`

---

## 🎯 Bước Deploy Lên Netlify

### **Option 1: Deploy từ GitHub (Khuyên dùng)**

#### Bước 1: Đăng nhập Netlify
1. Truy cập: https://app.netlify.com
2. Đăng nhập bằng GitHub account

#### Bước 2: Tạo New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Chọn **"Deploy with GitHub"**
3. Authorize Netlify truy cập GitHub

#### Bước 3: Chọn Repository
1. Tìm repository: `tungvu82nt/dandan`
2. Click vào repository

#### Bước 4: Cấu Hình Build Settings
**Netlify sẽ tự động detect**, nhưng xác nhận:

```
Branch to deploy: main
Base directory: (để trống)
Build command: npm run build
Publish directory: dist
```

#### Bước 5: Deploy
1. Click **"Deploy site"**
2. Đợi ~2-3 phút để build
3. Site URL sẽ có dạng: `https://random-name-123456.netlify.app`

---

### **Option 2: Deploy Manual (Từ Folder Local)**

#### Bước 1: Build Local
```bash
cd d:/Tool/TOOL/dandan
npm install
npm run build
```

Kiểm tra folder `dist/` đã được tạo.

#### Bước 2: Deploy Folder `dist`
1. Vào https://app.netlify.com
2. Drag & drop folder `dist/` vào trang
3. Netlify tự động upload và deploy

---

## ⚙️ Cấu Hình Netlify (Đã Có Sẵn)

### 1. **netlify.toml** (Root Level)
```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. **public/_redirects**
```
/* /index.html 200
```

Cả 2 file này đảm bảo:
- ✅ Build command đúng
- ✅ SPA routing hoạt động (HashRouter)
- ✅ 404 redirect về index.html

---

## 🔍 Kiểm Tra Sau Deploy

### Test các trang quan trọng:
1. **Trang chủ**: `https://your-site.netlify.app/`
2. **Trang Admin**: `https://your-site.netlify.app/#/admin/login`
   - Username: `admin`
   - Password: `123456`
3. **Trang About**: `https://your-site.netlify.app/#/about`
4. **Thông báo chạy**: Kiểm tra NoticeBar ở trang chủ

### Kiểm tra Console (F12):
- ❌ Không có lỗi "MIME type" 
- ❌ Không có lỗi "Failed to load module"
- ✅ React DevTools hoạt động
- ✅ Tailwind CSS được load

---

## 🐛 Troubleshooting

### Lỗi: "Failed to load module script: MIME type"
**Nguyên nhân:** Build chưa chạy, đang load file `.tsx` trực tiếp

**Giải pháp:**
1. Chạy `npm run build` local để test
2. Xác nhận folder `dist/` được tạo
3. Re-deploy trên Netlify

---

### Lỗi: 404 khi refresh trang
**Nguyên nhân:** SPA redirect chưa config

**Giải pháp:**
- ✅ Đã có file `netlify.toml` với redirect rules
- ✅ Đã có file `public/_redirects`
- Project dùng **HashRouter** nên không bị lỗi này

---

### Lỗi: Tailwind CSS không load
**Nguyên nhân:** Đang dùng CDN (chỉ dev)

**Lưu ý:** 
- Warning `cdn.tailwindcss.com should not be used in production` là bình thường
- Để fix hoàn toàn, cần cài Tailwind CSS vào project (optional)

**Cách fix (Optional):**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Nhưng hiện tại CDN vẫn hoạt động tốt!

---

### Build fails trên Netlify
**Kiểm tra:**
1. Node version: Đảm bảo >= 18
2. Dependencies: Chạy `npm install` trước
3. TypeScript errors: Chạy local để check

**View build logs:**
- Vào Netlify Dashboard
- Click vào site
- Tab "Deploys" → Click vào build failed
- Xem log để debug

---

## 🎨 Tùy Chỉnh Domain (Optional)

### Đổi tên subdomain:
1. Vào Site Settings → Domain management
2. Click **"Options"** → **"Edit site name"**
3. Đổi từ `random-name-123456` → `dandan-charity` (hoặc tên khác)
4. URL mới: `https://dandan-charity.netlify.app`

### Thêm Custom Domain:
1. Mua domain (vd: `dandan.com`)
2. Vào Domain management → Add custom domain
3. Update DNS records theo hướng dẫn Netlify

---

## 📊 Environment Variables (Nếu Cần)

Nếu app cần API keys hoặc secrets:

1. Vào Site Settings → Environment variables
2. Thêm biến:
   - Key: `VITE_API_KEY`
   - Value: `your-secret-key`
3. Re-deploy để apply

**Lưu ý:** Project hiện tại dùng LocalStorage, không cần env vars!

---

## ✅ Checklist Deploy

- [ ] Code đã push lên GitHub (`main` branch)
- [ ] File `netlify.toml` đã có trong root
- [ ] File `public/_redirects` đã có
- [ ] Test build local: `npm run build` thành công
- [ ] Connect Netlify với GitHub repo
- [ ] Cấu hình build settings đúng
- [ ] Deploy thành công, site live
- [ ] Test tất cả trang hoạt động
- [ ] Admin panel login được
- [ ] Thông báo chạy hiển thị đúng

---

## 📞 Support

Nếu gặp vấn đề:
1. Check build logs trên Netlify
2. Test build local: `npm run build && npm run preview`
3. Xem docs: https://docs.netlify.com
4. Liên hệ team dev

---

**Cập nhật:** 2025-01-05  
**Version:** 1.0.0  
**Status:** ✅ Ready to Deploy
