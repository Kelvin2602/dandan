# 🚀 Hướng dẫn Triển khai - 3 Luồng Chính

## ✅ Trạng thái: ĐÃ HOÀN THIỆN

Tất cả 3 luồng đã được implement đầy đủ và hoạt động tốt. Không có lỗi linter.

---

## 💰 1. LUỒNG QUYÊN GÓP DỰ ÁN

### Mô tả:
User xem dự án → Nhập số tiền → Donate → Tự động cập nhật progress bar & donors

### Flow:
```
/ → /projects → /projects/:id → Input amount → Click "立即捐款"
                                                      ↓
                                          addDonation() được gọi
                                                      ↓
                                    ┌─────────────────┴─────────────────┐
                                    ↓                                   ↓
                        Create DonationRecord               Update Project
                        - id: timestamp                     - raised += amount
                        - date: today                       - donors += 1
                        - donor, amount, etc.                     ↓
                                    ↓                       Save LocalStorage
                        Save LocalStorage                         ↓
                                    ↓                   Update UI real-time
                        Show success alert
```

### Code quan trọng:

**File: `pages/ProjectDetail.tsx` (dòng 26-48)**
```typescript
const handleDonate = async () => {
    if (!donateAmount || Number(donateAmount) <= 0) {
        alert("请输入有效的捐赠金额");
        return;
    }
    setIsDonating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addDonation({
        donor: '热心网友',
        amount: Number(donateAmount),
        projectTitle: project.title,
        payType: '微信支付',
        channel: '官网PC端'
    });
    
    setIsDonating(false);
    alert(`感谢您的善心！成功捐赠 ${donateAmount} 元。`);
    setDonateAmount('');
};
```

**File: `contexts/DataContext.tsx` (dòng 84-105)**
```typescript
const addDonation = (record) => {
    const newDonation = {
        ...record,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
    };
    
    setDonations(prev => [newDonation, ...prev]);
    
    // TỰ ĐỘNG cập nhật project
    setProjects(prevProjects => prevProjects.map(p => {
        if (p.title === record.projectTitle) {
            return {
                ...p,
                raised: p.raised + record.amount,
                donors: p.donors + 1
            };
        }
        return p;
    }));
};
```

### Test steps:
1. Vào `http://localhost:3000`
2. Click vào project bất kỳ
3. Nhập số tiền: `100`
4. Click "立即捐款"
5. ✅ Kiểm tra: Progress bar tăng, donors +1, donation table cập nhật

---

## 🙋 2. LUỒNG ĐĂNG KÝ TÌNH NGUYỆN VIÊN

### Mô tả:
User điền form → Validate (Zod) → Submit → Status 'pending' → Admin duyệt

### Flow:
```
/volunteer → Fill form → Validate with Zod → Submit
                                                ↓
                                    addVolunteer() được gọi
                                                ↓
                                    Create Volunteer record
                                    - id: timestamp
                                    - status: 'pending'
                                    - date: today
                                    - name, phone, email, area, interest
                                                ↓
                                    Save to LocalStorage
                                                ↓
                                    Show success alert
                                                ↓
                                    Admin view at /admin/volunteers
                                                ↓
                                    Approve or Reject
```

### Validation Rules (Zod):

**File: `pages/Volunteer.tsx` (dòng 9-16)**
```typescript
const volunteerSchema = z.object({
    name: z.string().min(2, "姓名至少需要2个字符"),
    phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的11位手机号码"),
    email: z.string().email("请输入有效的电子邮箱地址"),
    area: z.string().min(1, "请选择所在区域"),
    interests: z.array(z.string()).min(1, "请至少选择一项志愿服务意向"),
    bio: z.string().min(10, "个人简介至少需要10个字符").max(500, "...")
});
```

### Submit Handler:

**File: `pages/Volunteer.tsx` (dòng 34-50)**
```typescript
const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addVolunteer({
        name: data.name,
        phone: data.phone,
        email: data.email,
        area: data.area,
        interest: data.interests.join(', ')
    });
    
    alert('提交成功！我们会尽快联系您。请在管理后台查看您的申请。');
    reset();
};
```

**File: `contexts/DataContext.tsx` (dòng 69-77)**
```typescript
const addVolunteer = (data) => {
    const newVolunteer = {
        ...data,
        id: Date.now(),
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
    };
    setVolunteers(prev => [newVolunteer, ...prev]);
};
```

### Admin Approval:

**File: `pages/Admin/VolunteerManager.tsx` (dòng 59-70)**
```typescript
<button onClick={() => updateVolunteerStatus(v.id, 'approved')}>
    通过
</button>
<button onClick={() => updateVolunteerStatus(v.id, 'rejected')}>
    拒绝
</button>
```

### Test steps:
1. Vào `http://localhost:3000/volunteer`
2. Điền form:
   - Name: `王小明`
   - Phone: `13800138000`
   - Email: `wang@example.com`
   - Area: `未央区`
   - Interests: Check `社区服务`
   - Bio: `我有5年志愿服务经验，热心公益事业。`
3. Click "提交申请"
4. Login admin: `/admin/login` (admin/123456)
5. Vào `/admin/volunteers`
6. ✅ Kiểm tra: Thấy đơn mới, click "通过" hoặc "拒绝"

---

## 🔐 3. LUỒNG QUẢN TRỊ HỆ THỐNG (ADMIN)

### Mô tả:
Admin login → Quản lý projects/donations/volunteers → Cấu hình website

### Flow:
```
/admin/login → Input credentials → AuthContext.login()
                                          ↓
                              Check: admin/123456
                                          ↓
                              Save token to LocalStorage
                                          ↓
                              Navigate to /admin
                                          ↓
                    ┌─────────────────────┴─────────────────────┐
                    ↓                                             ↓
            View Dashboard                              Manage Content
            - Stats cards                               - Projects (CRUD)
            - Pending tasks                             - Donations (View)
            - System info                               - Volunteers (Approve)
                                                        - Settings (Config)
                                                              ↓
                                                    Update SiteConfig
                                                              ↓
                                                    Front-end auto update
```

### Authentication:

**File: `pages/Admin/Login.tsx` (dòng 12-22)**
```typescript
const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (data.username === 'admin' && data.password === '123456') {
        login('demo-token');
        navigate('/admin');
    } else {
        setError('root', { message: '用户名或密码错误' });
    }
};
```

**File: `contexts/AuthContext.tsx` (dòng 21-29)**
```typescript
const login = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
};

const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
};
```

### Settings Configuration:

**File: `pages/Admin/Settings.tsx` (dòng 24-27)**
```typescript
const onSubmit = (data) => {
    updateConfig(data);
    alert("设置已保存！前台页面已更新。");
};
```

**File: `contexts/SiteConfigContext.tsx` (dòng 60-68)**
```typescript
const updateConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('siteConfig', JSON.stringify(newConfig));
};

const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.setItem('siteConfig', JSON.stringify(DEFAULT_CONFIG));
};
```

### Admin Pages:
- `/admin` - Dashboard (stats overview)
- `/admin/projects` - Project Manager (CRUD)
- `/admin/donations` - Donation Manager (view only)
- `/admin/volunteers` - Volunteer Manager (approve/reject)
- `/admin/settings` - System Settings (header, banners, footer)

### Test steps:
1. Vào `http://localhost:3000/admin/login`
2. Login: `admin` / `123456`
3. ✅ Redirect to `/admin`
4. Test Settings:
   - Vào `/admin/settings`
   - Thay đổi "Header Banner 图片链接"
   - Add/remove banner slides
   - Cập nhật footer info
   - Click "保存设置"
   - Quay về trang chủ → Kiểm tra thay đổi
5. Test Project CRUD:
   - Vào `/admin/projects`
   - Click "发布新项目"
   - Điền form → "立即发布"
   - ✅ Project mới xuất hiện
6. Test Volunteer Approval:
   - Vào `/admin/volunteers`
   - Click "通过" cho volunteer pending
   - ✅ Status chuyển thành "已通过"

---

## 📦 DATA PERSISTENCE

Tất cả dữ liệu được lưu trong LocalStorage:

```javascript
// Keys
localStorage.app_projects      // Projects array
localStorage.app_volunteers    // Volunteers array
localStorage.app_donations     // Donations array
localStorage.siteConfig        // Site configuration
localStorage.adminToken        // Admin auth token
```

### Auto-sync mechanism:
```typescript
// Trong DataContext.tsx
useEffect(() => {
    localStorage.setItem('app_projects', JSON.stringify(projects));
}, [projects]);

useEffect(() => {
    localStorage.setItem('app_volunteers', JSON.stringify(volunteers));
}, [volunteers]);

useEffect(() => {
    localStorage.setItem('app_donations', JSON.stringify(donations));
}, [donations]);
```

---

## ✅ CHECKLIST HOÀN THIỆN

### Luồng 1: Quyên góp ✅
- [x] User input amount
- [x] Validate amount > 0
- [x] Create donation record
- [x] Auto update project.raised
- [x] Auto update project.donors
- [x] Show in donation table (Home)
- [x] Show in transaction list
- [x] LocalStorage sync
- [x] Real-time UI update

### Luồng 2: Tình nguyện viên ✅
- [x] Form với validation (Zod)
- [x] Phone regex check (11 digits)
- [x] Email format check
- [x] Checkboxes for interests
- [x] Create volunteer với status 'pending'
- [x] Admin view pending list
- [x] Approve/Reject functionality
- [x] Status update UI
- [x] LocalStorage sync

### Luồng 3: Admin ✅
- [x] Login authentication
- [x] Protected routes
- [x] Dashboard với stats
- [x] Project CRUD (Create, Read, Update, Delete)
- [x] Donation viewing
- [x] Volunteer approval system
- [x] Settings configuration
- [x] Header/Banner dynamic update
- [x] Footer info dynamic update
- [x] Real-time front-end sync
- [x] LocalStorage persistence

---

## 🎯 KẾT LUẬN

**Tất cả 3 luồng đã được implement đầy đủ và hoạt động ổn định.**

Không cần thêm code mới. Hệ thống đã:
- ✅ Có validation đầy đủ
- ✅ Real-time update
- ✅ Data persistence
- ✅ Admin management
- ✅ User-friendly UI
- ✅ No linter errors

**Để chạy dự án:**
```bash
npm install
npm run dev
# Truy cập: http://localhost:3000
```

**Admin login:**
- URL: http://localhost:3000/admin/login
- Username: admin
- Password: 123456
