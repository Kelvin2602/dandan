import React from 'react';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

const Footer: React.FC = () => {
  const { config } = useSiteConfig();
  const { footer } = config;

  return (
    <footer className="w-full bg-bgFooter border-t border-borderGray pt-8 pb-8 mt-12 text-textSub">
      <div className="w-container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Donation Info */}
          <div className="flex-1">
            <h2 className="text-textMain font-bold text-lg mb-4 border-l-4 border-primary pl-3">
              捐赠账号
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-primary font-bold">开户单位:</span> {footer.bankUnit}
              </p>
              <p>
                <span className="text-primary font-bold">开 户 行:</span> {footer.bankName}
              </p>
              <p>
                <span className="text-primary font-bold">捐赠账号:</span> {footer.bankAccount}
              </p>
              <p>
                <span className="text-primary font-bold">咨询电话:</span> {footer.phone}{' '}
                （综合办公室）
              </p>
              <p>
                <span className="text-primary font-bold">项目咨询:</span> 029-86785599
                （项目与救助部）
              </p>
              <p className="text-xs text-textLight mt-2">备注：请注明捐款用途及项目名称</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-[2] text-sm leading-7">
            <h3 className="font-bold text-lg mb-2 text-textMain">长安仁爱慈善基金会</h3>
            <p>地址：{footer.address}</p>
            <p>电话：{footer.phone}</p>
            <p>邮箱：{footer.email}</p>
            <p>邮编：710000</p>
            <p className="mt-4">
              <a href="#" className="hover:text-primary transition-colors">
                陕ICP备19024568号-1
              </a>
            </p>
            <p>技术支持：{footer.techSupport}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
