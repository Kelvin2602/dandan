import React from 'react';
import { useData } from '../contexts/DataContext';

const FundsList: React.FC = () => {
  const { funds } = useData();

  return (
    <div className="bg-white py-8 min-h-screen">
      <div className="w-container mx-auto">
        <div className="w-full h-[180px] bg-blue-600 mb-8 flex items-center justify-center">
          <h1 className="text-3xl text-white font-bold">公益基金</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {funds.map((fund) => (
            <div
              key={fund.id}
              className="border border-gray-200 rounded overflow-hidden hover:shadow-xl transition-all flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={fund.image}
                  alt={fund.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 h-12">{fund.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 flex-1">
                  <p>发起方：{fund.sponsor}</p>
                  <p>成立时间：{fund.date}</p>
                  <p>
                    基金总额：
                    <span className="text-accent font-bold text-lg">
                      ￥{fund.raised.toLocaleString()}
                    </span>
                  </p>
                </div>
                <button className="w-full bg-primary text-white py-2 mt-4 rounded hover:bg-secondary">
                  了解详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundsList;
