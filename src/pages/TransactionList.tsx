import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';

const TransactionList: React.FC = () => {
  const { donations } = useData(); // Use dynamic data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [keyword, setKeyword] = useState('');
  const [payType, setPayType] = useState('全部');

  const filteredData = useMemo(() => {
    return donations.filter((item) => {
      // Date Filter
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;

      // Amount Filter
      const amount = item.amount;
      if (minAmount && amount < parseFloat(minAmount)) return false;
      if (maxAmount && amount > parseFloat(maxAmount)) return false;

      // Keyword Filter
      if (keyword && !item.donor.includes(keyword) && !item.projectTitle.includes(keyword))
        return false;

      return true;
    });
  }, [donations, startDate, endDate, minAmount, maxAmount, keyword, payType]);

  return (
    <div className="bg-white py-8 min-h-screen">
      <div className="w-container mx-auto">
        {/* Banner */}
        <div className="w-full h-[180px] bg-gradient-to-r from-primary to-orange-500 mb-8 flex items-center justify-center">
          <h1 className="text-3xl text-white font-bold">收支明细公示</h1>
        </div>

        <div className="border border-gray-200 p-6 rounded-sm mb-8">
          {/* Filters */}
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="font-bold w-20 md:text-right">时间：</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="border border-gray-300 px-2 py-1 rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span>至</span>
                <input
                  type="date"
                  className="border border-gray-300 px-2 py-1 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex gap-2 md:ml-4">
                <button
                  className="hover:text-primary hover:bg-gray-100 px-2 py-1 rounded"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  清除日期
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="font-bold w-20 md:text-right">金额：</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border border-gray-300 px-2 py-1 rounded w-32"
                  placeholder="最小金额"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
                <span>至</span>
                <input
                  type="number"
                  className="border border-gray-300 px-2 py-1 rounded w-32"
                  placeholder="最大金额"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="font-bold w-20 md:text-right">关键字：</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="捐赠人/项目名称"
                  className="border border-gray-300 px-3 py-1 rounded w-64"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary - Dynamic */}
        <div className="flex mb-8 border border-gray-200">
          <div className="flex-1 p-4 border-r border-gray-200 text-center">
            <h4 className="text-gray-500 mb-1">当前列表收入总计</h4>
            <div className="text-2xl text-accent font-bold">
              ￥{filteredData.reduce((acc, cur) => acc + cur.amount, 0).toLocaleString()}
            </div>
          </div>
          <div className="flex-1 p-4 text-center">
            <h4 className="text-gray-500 mb-1">共找到记录</h4>
            <div className="text-2xl text-blue-500 font-bold">{filteredData.length} 条</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left text-gray-600 border border-gray-200">
            <thead className="bg-gray-50 text-gray-800 font-bold">
              <tr>
                <th className="px-4 py-3 border-b">交易时间</th>
                <th className="px-4 py-3 border-b">金额</th>
                <th className="px-4 py-3 border-b">捐赠方/收款方</th>
                <th className="px-4 py-3 border-b">项目名称</th>
                <th className="px-4 py-3 border-b">支付方式</th>
                <th className="px-4 py-3 border-b">平台</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border-b">{d.date}</td>
                    <td className="px-4 py-3 border-b font-bold text-accent">
                      ￥{d.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 border-b">{d.donor}</td>
                    <td className="px-4 py-3 border-b">{d.projectTitle}</td>
                    <td className="px-4 py-3 border-b">{d.payType}</td>
                    <td className="px-4 py-3 border-b">{d.channel}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    没有找到匹配的记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
