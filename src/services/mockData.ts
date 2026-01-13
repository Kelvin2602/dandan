import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: '首页', path: '/' },
  {
    id: 'info', label: '信息公开', path: '/info',
    children: [
      { id: 'i1', label: '网络资料下载', path: '/info/download' },
      { id: 'i2', label: '财务工作报告', path: '/info/financial' },
      { id: 'i3', label: '年度工作报告', path: '/info/annual' },
      { id: 'i4', label: '收支明细', path: '/info/transactions' },
    ]
  },
  {
    id: 'news', label: '新闻中心', path: '/news',
    children: [
      { id: 'n1', label: '慈善资讯', path: '/news/charity' },
      { id: 'n2', label: '媒体报道', path: '/news/media' },
      { id: 'n3', label: '区县动态', path: '/news/district' },
    ]
  },
  { id: 'projects', label: '慈善项目', path: '/projects' },
  { id: 'funds', label: '公益基金', path: '/funds' },
  { id: 'volunteer', label: '志愿服务', path: '/volunteer' },
  { id: 'about', label: '机构介绍', path: '/about' },
];