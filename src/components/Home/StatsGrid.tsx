import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

export const StatsGrid: React.FC = () => {
  const { statistics } = useData();
  const { config } = useSiteConfig();
  const { baseStats } = config;

  const totalRaised = (baseStats?.raised || 0) + (statistics?.totalRaised || 0);
  // Distributed is currently manual only via baseStats as we don't have a reliable DB field yet
  const totalDistributed = (baseStats?.distributed || 0);
  const totalDonors = (baseStats?.donors || 0) + (statistics?.totalDonors || 0);

  // Helper to format large numbers for Chinese context
  const formatChineseNumber = (num: number) => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(2) + '亿';
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(0) + '万';
    }
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 border-b border-gray-100 pb-8">
      <div className="text-center p-4 hover:bg-gray-50 transition-colors rounded">
        <h3 className="text-3xl font-bold text-primary mb-2">{formatChineseNumber(totalRaised)}</h3>
        <p className="text-gray-500 text-sm">截止当前募捐总额</p>
      </div>
      <div className="text-center p-4 border-l border-r border-gray-100 hover:bg-gray-50 transition-colors rounded">
        <h3 className="text-3xl font-bold text-primary mb-2">{formatChineseNumber(totalDistributed)}</h3>
        <p className="text-gray-500 text-sm">截止当前拨付总额</p>
      </div>
      <div className="text-center p-4 hover:bg-gray-50 transition-colors rounded">
        <h3 className="text-3xl font-bold text-primary mb-2">{formatChineseNumber(totalDonors)}</h3>
        <p className="text-gray-500 text-sm">截止当前捐赠人次</p>
      </div>
    </div>
  );
};