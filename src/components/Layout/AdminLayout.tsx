import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, FileText, Heart, Users, LogOut, Settings } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: '概览面板', path: '/admin' },
    { icon: <FileText size={20} />, label: '项目管理', path: '/admin/projects' },
    { icon: <FileText size={20} />, label: '新闻管理', path: '/admin/news' },
    { icon: <Heart size={20} />, label: '捐赠记录', path: '/admin/donations' },
    { icon: <Users size={20} />, label: '志愿者管理', path: '/admin/volunteers' },
    { icon: <Settings size={20} />, label: '系统设置', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full shadow-xl">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-bold tracking-wider">管理后台</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                (item.path === '/admin' && location.pathname === '/admin') || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded text-gray-400 hover:bg-red-900/50 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20">
            <h2 className="text-gray-700 font-bold">长安仁爱慈善基金会 - 内容管理系统</h2>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">管理员: Admin</span>
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;