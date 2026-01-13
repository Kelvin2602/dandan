# 📢 Hướng Dẫn Quản Lý Thông Báo Chạy (Notice Bar)

## Tổng Quan

Hệ thống quản lý thông báo cho phép Admin thêm, sửa, xóa các thông báo hiển thị trên thanh công bố ở trang chủ. Các thông báo sẽ tự động chạy liên tục và lặp lại mượt mà.

---

## 🎯 Tính Năng

### 1. **Hiển Thị Động Từ Admin**
- Tất cả thông báo được quản lý từ trang Admin Settings
- Thay đổi ngay lập tức không cần reload server
- Lưu trữ vào LocalStorage, data vẫn giữ nguyên khi reload

### 2. **Chạy Liên Tục & Lặp Lại**
- Các thông báo tự động chạy từ phải qua trái
- Tự động lặp lại liên tục không dừng
- Hover chuột để tạm dừng xem chi tiết
- Animation mượt mà với Tailwind CSS

### 3. **Tùy Chỉnh Linh Hoạt**
- Thêm/xóa số lượng thông báo không giới hạn
- Tùy chỉnh icon emoji cho mỗi thông báo
- Đặt link điều hướng cho từng thông báo
- Sắp xếp thứ tự hiển thị

---

## 📋 Cấu Trúc Data

### Interface `NoticeItem` (types.ts)
```typescript
export interface NoticeItem {
  id: string;           // ID duy nhất (timestamp)
  content: string;      // Nội dung thông báo
  link: string;         // Đường dẫn điều hướng
  icon?: string;        // Emoji icon (mặc định: 📢)
}
```

### Ví dụ:
```typescript
{
  id: '1',
  content: '长安仁爱慈善基金会郑重声明：谨防诈骗',
  link: '/news/n1',
  icon: '📢'
}
```

---

## 🛠️ Hướng Dẫn Sử Dụng Admin

### Bước 1: Truy cập trang Admin Settings
1. Đăng nhập Admin: `http://localhost:3000/#/admin/login`
2. Username: `admin` / Password: `123456`
3. Vào menu **"系统设置"** (System Settings)

### Bước 2: Tìm phần "公告栏通知设置"
- Nằm ở **vị trí thứ 2** trong trang Settings
- Có icon 🔔 và viền xanh nổi bật

### Bước 3: Thêm Thông Báo Mới
1. Click nút **"+ 添加通知"**
2. Điền thông tin:
   - **图标** (Icon): Emoji 1-2 ký tự (vd: 📢 🎉 ⚠️ 💡)
   - **通知内容** (Content): Nội dung thông báo (bắt buộc)
   - **跳转链接** (Link): Đường dẫn điều hướng (bắt buộc, vd: `/news/n1`)

### Bước 4: Xóa/Sửa Thông Báo
- **Xóa**: Click nút "🗑️ 删除" bên phải mỗi thông báo
- **Sửa**: Chỉnh sửa trực tiếp trong ô input

### Bước 5: Lưu Thay Đổi
1. Click nút **"💾 保存设置"** ở góc dưới bên phải
2. Thông báo "设置已保存！前台页面已更新。" xuất hiện
3. Reload trang chủ để thấy thay đổi ngay lập tức

---

## 💻 Code Implementation

### 1. **Context (SiteConfigContext.tsx)**
```typescript
export interface SiteConfig {
  // ...existing config
  notices: NoticeItem[];  // ← Mảng thông báo
}

const DEFAULT_CONFIG: SiteConfig = {
  notices: [
    { id: '1', content: '...', link: '/news/n1', icon: '📢' },
    // ...
  ]
}
```

### 2. **Component (NoticeBar.tsx)**
```typescript
export const NoticeBar: React.FC = () => {
  const { config } = useSiteConfig();
  
  // Lặp đôi mảng để tạo hiệu ứng chạy mượt
  const repeatedNotices = [...config.notices, ...config.notices];

  return (
    <div className="animate-marquee">
      {repeatedNotices.map((notice, index) => (
        <Link key={`${notice.id}-${index}`} to={notice.link}>
          {notice.icon || '📢'} {notice.content}
        </Link>
      ))}
    </div>
  );
};
```

### 3. **Admin Form (Settings.tsx)**
```typescript
const { fields, append, remove } = useFieldArray({
  control,
  name: "notices"
});

// Thêm notice mới
append({ 
  id: Date.now().toString(), 
  content: '', 
  link: '/', 
  icon: '📢' 
});

// Xóa notice
remove(index);
```

---

## 🎨 CSS Animation

Animation marquee được định nghĩa trong Tailwind config:

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.pause-on-hover:hover .animate-marquee {
  animation-play-state: paused;
}
```

---

## 🔍 Kiểm Tra & Debug

### Kiểm tra Data trong LocalStorage:
```javascript
// Mở DevTools Console
console.log(JSON.parse(localStorage.getItem('siteConfig')).notices);
```

### Reset về mặc định:
- Click nút **"🔄 恢复默认"** ở góc trên bên phải trang Settings
- Hoặc xóa key `siteConfig` trong LocalStorage

---

## 📝 Lưu Ý Quan Trọng

### ✅ Do's
- Nội dung thông báo nên ngắn gọn (< 50 ký tự) để dễ đọc khi chạy
- Sử dụng emoji phổ biến dễ hiểu (📢 🎉 ⚠️ 💡 🏆)
- Link phải là đường dẫn nội bộ (bắt đầu bằng `/`)
- Nên có ít nhất 2-3 thông báo để animation mượt mà

### ❌ Don'ts
- Không để nội dung quá dài (gây khó đọc)
- Không dùng emoji phức tạp hoặc không hỗ trợ
- Không để link ngoài (external links) - có thể gây lỗi routing
- Không xóa hết tất cả thông báo (sẽ hiển thị trống)

---

## 🚀 Kịch Bản Sử Dụng Thực Tế

### Ví dụ 1: Thêm Thông Báo Khẩn Cấp
```typescript
Icon: ⚠️
Content: 紧急通知：明日系统维护12:00-14:00
Link: /news/maintenance
```

### Ví dụ 2: Chúc Mừng Sự Kiện
```typescript
Icon: 🎉
Content: 热烈庆祝基金会募捐突破10亿元
Link: /about
```

### Ví dụ 3: Cảnh Báo An Toàn
```typescript
Icon: 🔒
Content: 谨防诈骗！官方仅通过此网站接受捐款
Link: /news/security
```

---

## 📊 Hiệu Năng

- **Render Performance**: Tối ưu với React memo và key prop
- **Storage**: ~500 bytes cho 5 thông báo (LocalStorage)
- **Animation**: CSS-based, không ảnh hưởng JavaScript performance
- **Browser Support**: Tất cả modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🔗 Files Liên Quan

1. `types.ts` - Interface định nghĩa
2. `contexts/SiteConfigContext.tsx` - Context provider
3. `components/Home/NoticeBar.tsx` - UI component
4. `pages/Admin/Settings.tsx` - Admin form
5. `tailwind.config.js` - Animation config (nếu custom)

---

## 📞 Support

Nếu có vấn đề:
1. Kiểm tra Console Log (F12)
2. Xác nhận data trong LocalStorage
3. Thử reset về default settings
4. Liên hệ team dev nếu lỗi persist

---

**Ngày cập nhật**: 2025-01-05  
**Version**: 1.0.0  
**Tác giả**: AI Assistant
