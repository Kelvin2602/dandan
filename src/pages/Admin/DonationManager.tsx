import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Search, Download } from 'lucide-react';
import { SEO } from '../../components/Shared/SEO';
import { ExportService } from '../../services/exportService';

const DonationManager: React.FC = () => {
  const { donations } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = donations.filter(d =>
    d.donor.includes(searchTerm) || d.projectTitle.includes(searchTerm)
  );

  const totalAmount = filteredData.reduce((acc, curr) => acc + curr.amount, 0);

  const handleExport = () => {
    const exportData = filteredData.map(d => ({
      '交易ID': d.id,
      '交易时间': d.date,
      '捐赠人': d.donor,
      '捐赠金额': d.amount,
      '捐助项目': d.projectTitle,
      '支付方式': d.payType,
      '来源渠道': d.channel
    }));

    const fileName = `捐赠记录_${new Date().toISOString().split('T')[0]}`;
    ExportService.exportToExcel(exportData, fileName, '捐赠明细');
  };

  return (
    <div>
      <SEO title="捐赠管理" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">捐赠记录管理</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={18} /> 导出 Excel
        </button>
      </div>

      {/* Stats Bar */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded mb-6 flex gap-8">
        <div>
          <span className="text-gray-500 text-sm">当前列表总额</span>
          <p className="text-2xl font-bold text-primary">￥{totalAmount.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-gray-500 text-sm">记录数</span>
          <p className="text-2xl font-bold text-gray-800">{filteredData.length} <span className="text-sm font-normal">笔</span></p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded shadow-sm mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索捐赠人或项目名称..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 font-bold text-sm">
            <tr>
              <th className="p-4 border-b">交易时间</th>
              <th className="p-4 border-b">捐赠人</th>
              <th className="p-4 border-b">捐赠金额</th>
              <th className="p-4 border-b">捐助项目</th>
              <th className="p-4 border-b">支付方式</th>
              <th className="p-4 border-b">来源渠道</th>
              <th className="p-4 border-b">状态</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredData.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 border-b last:border-0">
                <td className="p-4">{d.date}</td>
                <td className="p-4 font-medium">{d.donor}</td>
                <td className="p-4 text-accent font-bold">￥{d.amount}</td>
                <td className="p-4 text-gray-500 max-w-xs truncate">{d.projectTitle}</td>
                <td className="p-4">{d.payType}</td>
                <td className="p-4">{d.channel}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">成功</span>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">未找到相关记录</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationManager;