import React from 'react';
import { DollarSign, Users, FileText, Activity } from 'lucide-react';
import { SEO } from '../../components/Shared/SEO';
import { useData } from '../../contexts/DataContext';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-full ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { statistics, projects, volunteers } = useData();
  const { config } = useSiteConfig();
  const { baseStats } = config;

  const totalRaised = (baseStats?.raised || 0) + (statistics?.totalRaised || 0);
  const totalDonors = (baseStats?.donors || 0) + (statistics?.totalDonors || 0);
  const totalProjects = statistics?.totalProjets || projects.length; // Use context stats or raw length
  const totalVolunteers = volunteers.length;

  // Helper (Consistent with StatsGrid)
  const formatMoney = (num: number) => {
    if (num >= 100000000) {
      return '￥' + (num / 100000000).toFixed(2) + '亿';
    }
    if (num >= 10000) {
      return '￥' + (num / 10000).toFixed(1) + '万';
    }
    return '￥' + num.toLocaleString();
  };

  return (
    <div>
      <SEO title="管理概览" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">仪表盘</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总募捐额"
          value={formatMoney(totalRaised)}
          icon={<DollarSign size={24} />}
          color="bg-primary"
        />
        <StatCard
          title="活跃项目"
          value={`${totalProjects} 个`}
          icon={<FileText size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="注册志愿者"
          value={`${totalVolunteers} 人`}
          icon={<Users size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="累计捐赠人次"
          value={`${(totalDonors / 10000).toFixed(1)} 万`}
          icon={<Activity size={24} />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Actions */}
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">待处理事项</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">新的志愿者申请: 王小明</span>
              <button className="text-primary hover:underline">审核</button>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">项目 "助学计划" 即将到期</span>
              <button className="text-primary hover:underline">查看</button>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">5笔新的大额捐款待确认</span>
              <button className="text-primary hover:underline">确认</button>
            </li>
          </ul>
        </div>

        {/* System Info */}
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">系统信息</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>版本: v1.2.0</p>
            <p>上次备份: 2025-02-23 03:00</p>
            <p>服务器状态: <span className="text-green-500 font-bold">正常</span></p>
            <p>React 版本: 18.3.1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;