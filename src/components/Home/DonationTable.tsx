import React from 'react';
import { Link } from 'react-router-dom';
import { DonationRecord } from '../../types';

interface DonationTableProps {
  donations: DonationRecord[];
}

export const DonationTable: React.FC<DonationTableProps> = ({ donations }) => {
  return (
    <div className="mt-12 bg-white border border-gray-200 rounded">
      <div className="bg-[#fbfbfb] p-3 border-b border-gray-200 flex justify-between items-center rounded-t">
        <span className="font-bold text-gray-700">最新捐赠信息</span>
        <Link to="/info/transactions" className="text-xs text-gray-500 hover:text-primary">更多</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-bold">
            <tr>
              <th className="px-4 py-3">日期</th>
              <th className="px-4 py-3">捐赠人</th>
              <th className="px-4 py-3">金额</th>
              <th className="px-4 py-3">项目名称</th>
              <th className="px-4 py-3">支付方式</th>
            </tr>
          </thead>
          <tbody>
            {donations.slice(0, 5).map((d, idx) => (
              <tr key={d.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 transition-colors`}>
                <td className="px-4 py-2">{d.date}</td>
                <td className="px-4 py-2 font-medium text-gray-800">{d.donor}</td>
                <td className="px-4 py-2 text-accent font-bold">￥{d.amount}</td>
                <td className="px-4 py-2">{d.projectTitle}</td>
                <td className="px-4 py-2">{d.payType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};