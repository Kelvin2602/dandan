# 🚀 Quick Start: Linting & Formatting

## Các Lệnh Thường Dùng

### 🔍 Check Issues

```bash
npm run lint              # Kiểm tra lỗi ESLint
npm run format:check      # Kiểm tra format
```

### 🔧 Auto Fix

```bash
npm run lint:fix          # Fix ESLint errors
npm run format            # Format tất cả files
```

### 💾 Commit Code

```bash
git add .
git commit -m "feat: your message"
# → Pre-commit hook sẽ tự động lint & format
```

### ⚡ Skip Hooks (không khuyến nghị)

```bash
git commit -m "WIP" --no-verify
```

---

## 🎨 VSCode Setup

### Install Extensions

1. ESLint
2. Prettier
3. Tailwind CSS IntelliSense

### Enable Auto-format

Settings đã được cấu hình trong `.vscode/settings.json`:

- ✅ Format on save
- ✅ ESLint auto-fix on save

---

## 📋 Common Issues

### Issue: Hook không chạy

```bash
npm run prepare
```

### Issue: Too many errors

```bash
# Fix từng folder
npx eslint src/components --fix
npx eslint src/pages --fix
```

### Issue: Ignore một file

```javascript
/* eslint-disable */
// code here
/* eslint-enable */
```

---

## 📚 Full Documentation

- **LINTING_GUIDE.md** - Hướng dẫn chi tiết
- **SETUP_COMPLETE.md** - Setup summary

---

**Ready to code! 🎉**
