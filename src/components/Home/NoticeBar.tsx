import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { useData } from '../../contexts/DataContext';
import { Wallet, CheckCircle2, Users } from 'lucide-react';

export const NoticeBar: React.FC = () => {
  const { config } = useSiteConfig();
  const { statistics } = useData();
  const notices = config.notices || [];
  const { baseStats } = config;

  // Stats Logic
  const totalRaised = (baseStats?.raised || 0) + (statistics?.totalRaised || 0);
  const totalDistributed = (baseStats?.distributed || 0);
  const totalDonors = (baseStats?.donors || 0) + (statistics?.totalDonors || 0);

  const formatChineseNumber = (num: number) => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(2) + '亿';
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(2) + '万';
    }
    return num.toLocaleString();
  };

  const currentDate = new Date();
  const dateStr = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;

  return (
    <div className="w-container mx-auto bg-noticeBg mb-5">
      <div className="flex items-center h-[80px] px-2 py-2">
        {/* 1. Title Block */}
        <div 
          className="w-[160px] h-[60px] bg-no-repeat bg-center text-white font-bold text-[18px] leading-[60px] text-center mr-[20px] shrink-0"
          style={{ backgroundImage: "url('https://www.xascsh.com/static/default/static/images/ggBtg.png')" }}
        >
          总会公告
        </div>

        {/* 2. Scrolling List (Vertical Marquee) */}
        <div className="w-[300px] h-[60px] overflow-hidden relative mr-auto">
          <div className="absolute top-0 w-full animate-marquee-vertical pause-on-hover">
             <div className="flex flex-col">
               {[...notices, ...notices].map((notice, idx) => (
                  <Link 
                    key={`${notice.id}-${idx}`}
                    to={notice.link} 
                    className="block h-[50px] leading-[50px] text-textSub text-[15px] overflow-hidden whitespace-nowrap text-ellipsis hover:text-primary transition-colors"
                  >
                   {notice.content}
                  </Link>
               ))}
             </div>
          </div>
        </div>
        
        {/* 3. Stats Section (Floating Right in Legacy) */}
        <div className="flex gap-8 items-center h-full pr-4">
              {/* Stat 1: Raised */}
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-primary">
                    <Wallet size={24} />
                  </div>
                  <div>
                     <div className="text-xl font-bold text-primary leading-tight">
                         {formatChineseNumber(totalRaised)}
                     </div>
                     <div className="text-[12px] text-textSub text-nowrap">
                         截止{dateStr}募捐总额
                     </div>
                  </div>
              </div>

              {/* Stat 2: Distributed */}
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                     <div className="text-xl font-bold text-primary leading-tight">
                         {formatChineseNumber(totalDistributed)}
                     </div>
                     <div className="text-[12px] text-textSub text-nowrap">
                         截止{dateStr}拨付总额
                     </div>
                  </div>
              </div>

              {/* Stat 3: Donors */}
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-accent">
                    <Users size={24} />
                  </div>
                  <div>
                     <div className="text-xl font-bold text-primary leading-tight">
                         {formatChineseNumber(totalDonors)}
                     </div>
                     <div className="text-[12px] text-textSub text-nowrap">
                         截止{dateStr}捐赠人次
                     </div>
                  </div>
              </div>
        </div>

      </div>
    </div>
  );
};