# 🚀 快速启动指南
**长安仁爱慈善基金会 - 门户网站**

---

## ⚡ 一分钟快速启动

### **1. 安装依赖**
```bash
npm install
```

### **2. 启动开发服务器**
```bash
npm run dev
```

### **3. 打开浏览器**
```
http://localhost:3000
```

---

## 🔗 重要链接速查

### **前端用户页面:**
| 页面 | URL | 说明 |
|------|-----|------|
| 🏠 首页 | `http://localhost:3000/#/` | 轮播图、新闻、项目展示 |
| 📋 项目列表 | `http://localhost:3000/#/projects` | 所有慈善项目 |
| 📰 新闻资讯 | `http://localhost:3000/#/news` | 慈善资讯、媒体报道 |
| 💰 基金列表 | `http://localhost:3000/#/funds` | 各类专项基金 |
| 🤝 志愿者报名 | `http://localhost:3000/#/volunteer` | 在线填写志愿者申请 |
| 📊 交易公开 | `http://localhost:3000/#/info/transactions` | 捐赠记录查询 |
| ℹ️ 关于我们 | `http://localhost:3000/#/about` | 基金会简介 |

### **管理后台:**
| 功能 | URL | 登录 |
|------|-----|------|
| 🔐 登录页 | `http://localhost:3000/#/admin/login` | admin / 123456 |
| 📊 仪表盘 | `http://localhost:3000/#/admin` | 需登录 |
| 📁 项目管理 | `http://localhost:3000/#/admin/projects` | 需登录 |
| 💳 捐赠记录 | `http://localhost:3000/#/admin/donations` | 需登录 |
| 👥 志愿者审核 | `http://localhost:3000/#/admin/volunteers` | 需登录 |
| ⚙️ 系统设置 | `http://localhost:3000/#/admin/settings` | 需登录 |

---

## 🔑 登录凭证

### **管理员账号（演示）:**
```
用户名: admin
密码:   123456
```

**⚠️ 重要提示:**
- 这是演示账号，生产环境需更改
- 登录后Token保存在 LocalStorage
- 关闭浏览器后需重新登录

---

## 📦 项目结构速览

```
d:/Tool/TOOL/dandan/
├── components/          # React组件
│   ├── Layout/         # 头部、底部、管理后台布局
│   ├── Home/           # 首页专用组件
│   └── Shared/         # 共享组件
│
├── pages/              # 页面组件
│   ├── Admin/          # 管理后台页面（6个）
│   └── ...             # 公开页面（9个）
│
├── contexts/           # Context状态管理
│   ├── AuthContext     # 登录认证
│   ├── DataContext     # 数据管理
│   └── SiteConfigContext # 配置管理
│
├── services/           # 服务层
│   └── mockData.ts     # 模拟数据
│
├── types.ts            # TypeScript类型定义
├── App.tsx             # 主应用
├── index.tsx           # 入口文件
└── vite.config.ts      # Vite配置
```

---

## 🎯 常用功能测试

### **1. 测试捐赠流程**
```
1. 访问首页 → 点击任意项目
2. 进入项目详情页
3. 在捐赠表单输入金额（如：100）
4. 点击"立即捐款"
5. 查看"交易公开"页面验证记录
```

### **2. 测试志愿者报名**
```
1. 访问 /volunteer
2. 填写表单（姓名、电话、邮箱等）
3. 勾选服务意向
4. 提交表单
5. 登录管理后台 → 志愿者管理 → 查看新申请
```

### **3. 测试管理后台**
```
1. 访问 /admin/login
2. 输入 admin / 123456
3. 查看Dashboard统计
4. 添加新项目
5. 审核志愿者申请
6. 修改网站配置（Settings）
```

---

## 💾 数据存储说明

### **LocalStorage Keys:**
```javascript
// 业务数据
localStorage.charityData      // 项目、捐赠、志愿者

// 认证信息
localStorage.adminToken       // 管理员Token

// 网站配置
localStorage.siteConfig       // Banner、Footer信息
```

### **清空数据:**
```javascript
// 打开浏览器控制台（F12），执行：
localStorage.clear();
location.reload();
```

---

## 🛠️ 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build            # 打包生产版本

# 预览
npm run preview          # 预览生产构建

# 依赖管理
npm install              # 安装依赖
npm update               # 更新依赖
```

---

## 📱 响应式断点

```css
- Mobile:    < 768px
- Tablet:    768px - 1024px
- Desktop:   > 1024px
- Container: max-width: 1200px
```

---

## 🎨 主题色彩

```css
- 主红色:  #ca231e  (primary)
- 深红色:  #ba141a  (secondary)
- 橙色:    #fc960c  (accent)
- 黄色:    #f7b709  (badge)
```

---

## 🔍 快速调试

### **React DevTools:**
```
1. 安装 React Developer Tools 浏览器扩展
2. F12 打开开发者工具
3. 选择 "Components" 或 "Profiler" tab
```

### **查看Context状态:**
```javascript
// 在浏览器控制台执行：
JSON.parse(localStorage.getItem('charityData'))
JSON.parse(localStorage.getItem('siteConfig'))
```

---

## 📞 联系信息

### **长安仁爱慈善基金会:**
- 地址: 陕西省西安市莲湖区长安文化遗产大厦五层
- 电话: 029-86785588
- 邮箱: info@renai-changan.org

### **银行账户:**
- 开户单位: 长安仁爱慈善基金会
- 开户行: 浦发银行长安支行
- 捐赠账号: 62150178900000256

---

## ⚠️ 注意事项

1. **数据持久化:** 
   - 当前使用LocalStorage（仅适用于演示）
   - 生产环境需连接后端API

2. **图片资源:**
   - 使用外部CDN链接
   - 需稳定的网络连接

3. **浏览器兼容:**
   - 推荐使用Chrome 90+、Firefox 88+、Safari 14+
   - 不支持IE浏览器

4. **开发端口:**
   - 默认3000端口
   - 如被占用，Vite会自动选择其他端口

---

## 🎉 开始探索！

现在你可以开始探索长安仁爱慈善基金会的门户网站了！

**建议测试顺序:**
1. ✅ 浏览前端用户页面（首页、项目、新闻）
2. ✅ 测试捐赠流程
3. ✅ 填写志愿者申请
4. ✅ 登录管理后台
5. ✅ 审核志愿者、管理项目
6. ✅ 修改网站配置

---

**文档版本:** v1.0.0  
**最后更新:** 2026年01月05日
