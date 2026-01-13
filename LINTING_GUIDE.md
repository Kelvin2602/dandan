# 📋 Hướng Dẫn Linting & Formatting

## 🎯 Tổng Quan

Dự án đã được cấu hình với:

- **ESLint**: Kiểm tra lỗi code và enforce coding standards
- **Prettier**: Tự động format code theo style guide
- **Husky**: Git hooks để chạy lint trước khi commit
- **Lint-staged**: Chỉ lint các file đã thay đổi

---

## 🛠️ Các Công Cụ Đã Cài Đặt

### Dependencies

```json
{
  "eslint": "^9.39.2",
  "prettier": "^3.7.4",
  "husky": "^9.1.7",
  "lint-staged": "^16.2.7",
  "@typescript-eslint/parser": "^8.53.0",
  "@typescript-eslint/eslint-plugin": "^8.53.0",
  "eslint-plugin-react": "^7.37.5",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-config-prettier": "^10.1.8"
}
```

---

## 📜 Scripts Available

### Lint Commands

```bash
# Kiểm tra tất cả lỗi ESLint
npm run lint

# Tự động fix các lỗi có thể sửa được
npm run lint:fix
```

### Format Commands

```bash
# Format tất cả file
npm run format

# Kiểm tra xem có file nào chưa được format
npm run format:check
```

---

## ⚙️ Cấu Hình Files

### 1. ESLint Configuration (`.eslintrc.cjs`)

```javascript
// Extends:
- eslint:recommended
- plugin:@typescript-eslint/recommended
- plugin:react/recommended
- plugin:react-hooks/recommended
- prettier (disable conflicting rules)

// Key Rules:
- no-console: warn (allow console.warn, console.error)
- @typescript-eslint/no-explicit-any: warn
- react/react-in-jsx-scope: off (React 18+)
- react/prop-types: off (use TypeScript)
```

### 2. Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 3. Lint-staged Configuration (`.lintstagedrc.json`)

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}
```

### 4. Husky Pre-commit Hook (`.husky/pre-commit`)

```bash
#!/usr/bin/env sh
npx lint-staged
```

---

## 🔄 Workflow

### Khi Commit Code

1. **Stage các file thay đổi:**

   ```bash
   git add .
   ```

2. **Commit (pre-commit hook sẽ tự động chạy):**

   ```bash
   git commit -m "feat: add new feature"
   ```

3. **Husky sẽ tự động:**
   - Chạy ESLint trên các file staged
   - Tự động fix lỗi có thể sửa
   - Format code với Prettier
   - Nếu có lỗi không thể tự động fix → commit bị reject

### Manual Lint/Format

```bash
# Fix tất cả lỗi có thể (khuyến nghị chạy trước khi commit lớn)
npm run lint:fix

# Format toàn bộ project
npm run format

# Kiểm tra mà không fix
npm run lint
npm run format:check
```

---

## 🎨 VSCode Integration

### Extensions Cần Thiết

File `.vscode/extensions.json` đã recommend các extension:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **ES7+ React Snippets** (`dsznajder.es7-react-js-snippets`)

### Auto Format On Save

File `.vscode/settings.json` đã cấu hình:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**Có nghĩa là:**

- Mỗi khi bạn save file (Ctrl+S), code sẽ tự động được format
- ESLint sẽ tự động fix các lỗi có thể sửa

---

## 🚫 Ignore Patterns

### ESLint Ignore

```javascript
// .eslintrc.cjs
ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.ts', 'vite.config.ts'];
```

### Prettier Ignore

```
# .prettierignore
node_modules
dist
build
package-lock.json
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Pre-commit hook không chạy

```bash
# Re-install husky
npm run prepare

# Kiểm tra file .husky/pre-commit có executable permission
# (Trên Windows thường không cần, nhưng trên Mac/Linux cần)
chmod +x .husky/pre-commit
```

### Issue 2: ESLint báo lỗi "Parsing error"

```bash
# Đảm bảo @typescript-eslint/parser đã được cài
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Clear ESLint cache
npx eslint --cache-location .eslintcache --no-cache .
```

### Issue 3: Prettier và ESLint conflict

```bash
# Đảm bảo eslint-config-prettier được cài và extends trong .eslintrc.cjs
npm install -D eslint-config-prettier

# Kiểm tra file .eslintrc.cjs có 'prettier' trong extends và để cuối cùng
```

### Issue 4: Too many lint errors

```bash
# Fix từng thư mục một
npx eslint src/components --fix
npx eslint src/pages --fix
npx eslint server --fix

# Hoặc ignore tạm thời bằng comment
/* eslint-disable */
// code here
/* eslint-enable */

// Ignore một dòng cụ thể
const test = 'test'; // eslint-disable-line no-console
```

---

## 📊 Lint Report Example

### Before Lint

```typescript
// ❌ Bad code
import React from 'react'; // unnecessary in React 18
const x = 'test'; // should use single quotes
console.log(x); // should be console.warn or console.error
var y = 10; // should use const/let
```

### After Lint (npm run lint:fix)

```typescript
// ✅ Good code
const x = 'test';
console.warn(x);
const y = 10;
```

---

## 🎯 Best Practices

### 1. Commit Nhỏ, Thường Xuyên

```bash
# Tốt: commit từng feature nhỏ
git commit -m "feat: add login validation"
git commit -m "fix: correct button alignment"

# Không tốt: commit quá nhiều thay đổi cùng lúc
git commit -m "update everything"
```

### 2. Fix Lint Errors Trước Khi Push

```bash
# Chạy full lint check trước khi push
npm run lint:fix
npm run format

# Kiểm tra không có lỗi
npm run lint
```

### 3. Không Disable ESLint Rules Tùy Tiện

```typescript
// ❌ Avoid
/* eslint-disable */
// ... lots of code

// ✅ Better: fix cụ thể
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const data: any = await fetchData();
```

### 4. Use TypeScript Thay Vì Any

```typescript
// ❌ Bad
const data: any = response.json();

// ✅ Good
interface ResponseData {
  id: string;
  name: string;
}
const data: ResponseData = response.json();
```

---

## 📈 Monitoring Code Quality

### Current Status

```bash
# Check current lint status
npm run lint

# Example output:
# ✅ No errors found
# ⚠️  12 warnings (mostly console.log)
# ❌ 3 errors (need manual fix)
```

### Goals

- **Errors**: 0 (must fix)
- **Warnings**: < 50 (should fix gradually)
- **Code Coverage**: > 80% (future goal with testing)

---

## 🔗 References

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [Husky Documentation](https://typicode.github.io/husky/)

---

## ✅ Checklist

- [x] ESLint installed & configured
- [x] Prettier installed & configured
- [x] Husky pre-commit hooks setup
- [x] Lint-staged configured
- [x] VSCode settings configured
- [x] Scripts added to package.json
- [ ] Fix existing lint errors (in progress)
- [ ] Team training on linting workflow

---

**Happy Coding! 🚀**
