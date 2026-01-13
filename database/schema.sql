-- Drop tables if they exist (clean slate for dev)
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS funds CASCADE;
DROP TABLE IF EXISTS notices CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Core Tables

CREATE TABLE site_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'news', 'project', 'download'
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    title VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'default',
    link_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Content Modules

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT, -- HTML
    image_url VARCHAR(255),
    author VARCHAR(100),
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'fundraising', -- 'fundraising', 'completed'
    target_amount DECIMAL(12, 2) DEFAULT 0,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    donor_count INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    description TEXT,
    content TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    valid_date TIMESTAMP -- Legacy field support
);

CREATE TABLE funds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    total_amount DECIMAL(12, 2) DEFAULT 0,
    manager VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. User & Interaction Tables

CREATE TABLE users ( -- Renaming from admin_users to users for generality, can add role
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    skills TEXT,
    joined_at TIMESTAMP DEFAULT NOW(),
    hours_contributed INTEGER DEFAULT 0
);

CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    fund_id INTEGER REFERENCES funds(id),
    donor_name VARCHAR(100) DEFAULT 'Anonymous',
    amount DECIMAL(12, 2) NOT NULL,
    message TEXT,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_donations_project ON donations(project_id);
CREATE INDEX idx_donations_fund ON donations(fund_id);

-- Seed Data (Basic & Mock)
INSERT INTO categories (name, slug, type, sort_order) VALUES 
('Charity News', 'charity-news', 'news', 1),
('Media Reports', 'media-reports', 'news', 2),
('Education Support', 'education', 'project', 1),
('Medical Aid', 'medical', 'project', 2),
('Community', 'community', 'project', 3);

INSERT INTO site_config (key, value) VALUES 
('header', '{"logo": "", "contact": "029-86785588"}'),
('footer', '{"address": "陕西省西安市莲湖区长安文化遗产大厦五层", "phone": "029-86785588", "email": "info@renai-changan.org", "bankName": "浦发银行长安支行", "bankAccount": "62150178900000256"}'),
('stats', '{"raised": 542000000, "distributed": 489000000, "donors": 1280000}'),
('navigation', '[
  {"id":"home","label":"首页","path":"/"},
  {"id":"info","label":"信息公开","path":"/info","children":[
    {"id":"i1","label":"网络资料下载","path":"/info/download"},
    {"id":"i2","label":"财务工作报告","path":"/info/financial"},
    {"id":"i3","label":"年度工作报告","path":"/info/annual"},
    {"id":"i4","label":"收支明细","path":"/info/transactions"}
  ]},
  {"id":"news","label":"新闻中心","path":"/news","children":[
    {"id":"n1","label":"慈善资讯","path":"/news/charity"},
    {"id":"n2","label":"媒体报道","path":"/news/media"},
    {"id":"n3","label":"区县动态","path":"/news/district"}
  ]},
  {"id":"projects","label":"慈善项目","path":"/projects"},
  {"id":"funds","label":"公益基金","path":"/funds"},
  {"id":"volunteer","label":"志愿服务","path":"/volunteer"},
  {"id":"about","label":"机构介绍","path":"/about"}
]');

-- Seed Funds
INSERT INTO funds (name, image_url, total_amount, manager, description) VALUES
('西安慈善微基金', 'https://picsum.photos/400/300?random=10', 5000000.00, '张敬', '用于小微慈善项目的快速资助'),
('老年关爱基金', 'https://picsum.photos/400/300?random=11', 12000000.00, '李兰', '专注孤寡老人关怀');

-- Seed Projects
INSERT INTO projects (category_id, title, status, target_amount, raised_amount, donor_count, image_url, description, content, start_date, valid_date) VALUES 
(3, '阳光助学计划 2024', 'fundraising', 1000000.00, 450000.00, 1205, 'https://picsum.photos/400/300?random=1', '为贫困山区儿童提供书本和文具', '<p>详细项目介绍...</p>', NOW(), NOW() + INTERVAL '1 year'),
(4, '大病救助专项', 'fundraising', 2000000.00, 1500000.00, 3400, 'https://picsum.photos/400/300?random=2', '紧急救助重症困境患者', '<p>详细...</p>', NOW(), NOW() + INTERVAL '6 months'),
(5, '社区温暖行动', 'completed', 50000.00, 52000.00, 300, 'https://picsum.photos/400/300?random=3', '社区孤老冬日送温暖', '<p>已完成...</p>', NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 month');

-- Seed News
INSERT INTO news (category_id, title, summary, content, image_url, author, views, published_at) VALUES
(1, '西安市慈善会召开2025年度工作部署会', '会议确立了新的一年慈善工作的重点方向...', '<p>内文...</p>', 'https://picsum.photos/400/300?random=4', 'Admin', 2340, NOW() - INTERVAL '2 days'),
(2, '爱心企业捐赠百万物资驰援灾区', '某某集团向灾区捐赠价值100万元的生活物资...', '<p>内文...</p>', 'https://picsum.photos/400/300?random=5', 'MediaTeam', 1500, NOW() - INTERVAL '5 days'),
(1, '慈善志愿者招募正式启动', '我们期待您的加入，共同传递爱心...', '<p>内文...</p>', 'https://picsum.photos/400/300?random=6', 'HR', 800, NOW() - INTERVAL '1 week');

-- Seed Volunteers
INSERT INTO volunteers (name, phone, status, skills, joined_at) VALUES
('王明', '13800138000', 'approved', 'Medical, Teaching', NOW() - INTERVAL '1 year'),
('李华', '13900139000', 'pending', 'Driving', NOW() - INTERVAL '2 days');

-- Seed Notices
INSERT INTO notices (content, link_url) VALUES 
('防诈骗声明：本会从未授权任何个人进行...</', '#'),
('关于2024年度慈善先进评选结果公示', '/news/1'),
('紧急募捐：驰援抗洪一线', '/projects/2');

-- Seed Donations
INSERT INTO donations (project_id, donor_name, amount, message, payment_method, created_at) VALUES
(1, '张三', 100.00, '加油！', 'wechat', NOW()),
(1, '李四', 500.00, '尽绵薄之力', 'alipay', NOW()),
(2, '王五', 1000.00, '早日康复', 'bank_transfer', NOW());


-- Seed Admin User
INSERT INTO users (username, password_hash, role) VALUES 
('admin', '$2b$10$bIkKCG1kvt22wsNaGIhjTe6w9y/xeVgHkmYLUKMKDLuZ9DMYxAYLy', 'admin');
