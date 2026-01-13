import React, { useState, useEffect } from 'react';
import { Phone, QrCode, MessageCircle, ArrowUp, ArrowDown } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; content?: React.ReactNode }> = ({ icon, label, content }) => (
    <div className="relative group mb-1">
      <div className="w-12 h-12 bg-primary text-white flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors rounded-l-sm">
        {icon}
      </div>
      
      {/* Hover Content */}
      <div className="absolute right-12 top-0 h-full flex items-center pr-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        <div className="bg-white border border-primary p-2 text-primary whitespace-nowrap shadow-lg flex items-center rounded">
          {content || label}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed right-0 bottom-1/4 z-50 flex flex-col items-end">
      
      {/* Phone */}
      <SidebarItem 
        icon={<Phone size={20} />} 
        label="电话" 
        content={<span className="font-bold text-lg">029-88443055</span>} 
      />

      {/* QR Code */}
      <div className="relative group mb-1">
        <div className="w-12 h-12 bg-primary text-white flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors rounded-l-sm">
          <QrCode size={20} />
        </div>
        <div className="absolute right-12 top-[-50px] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-white border border-primary p-2 shadow-lg rounded">
                <img src="https://res-img.n.gongyibao.cn/uploads/1dbdc970-d95e-45a8-859b-86e4e9abe89e/20210825/248ac00189d845b09a8470fd7cf8e806.png" className="w-[120px] h-[120px]" alt="QR" />
                <p className="text-center text-xs mt-1 text-gray-600">扫码关注我们</p>
            </div>
        </div>
      </div>

       {/* WeChat */}
       <div className="relative group mb-1">
        <div className="w-12 h-12 bg-primary text-white flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors rounded-l-sm">
          <MessageCircle size={20} />
        </div>
        <div className="absolute right-12 top-[-50px] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-white border border-primary p-2 shadow-lg rounded">
                <img src="https://res-img.n.gongyibao.cn/uploads/1dbdc970-d95e-45a8-859b-86e4e9abe89e/20210825/248ac00189d845b09a8470fd7cf8e806.png" className="w-[120px] h-[120px]" alt="WeChat" />
                <p className="text-center text-xs mt-1 text-gray-600">微信咨询</p>
            </div>
        </div>
      </div>

      {/* Back to Top */}
      {showTopBtn && (
        <div 
            onClick={scrollToTop}
            className="w-12 h-12 bg-gray-600 text-white flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors rounded-l-sm mt-2"
            title="返回顶部"
        >
            <ArrowUp size={24} />
        </div>
      )}
    </div>
  );
};
