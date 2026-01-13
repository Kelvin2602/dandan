import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/Shared/Card';
import { SEO } from '../components/Shared/SEO';
import { Loading, ErrorMessage } from '../components/Shared/Loading';
import { HomeBanner } from '../components/Home/HomeBanner';
import { NoticeBar } from '../components/Home/NoticeBar';
import { StatsGrid } from '../components/Home/StatsGrid';
import { DonationTable } from '../components/Home/DonationTable';

const Home: React.FC = () => {
  const { projects, news: NEWS, funds: FUNDS, donations: DONATIONS, loading, error, refreshData } = useData();
  const [activeNewsTab, setActiveNewsTab] = useState<'news' | 'media' | 'district'>('news');

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refreshData} />;

  const getFilteredNews = () => {
    if (activeNewsTab === 'news') return NEWS.filter(n => n.category === 'charity'); 
    return NEWS.filter(n => n.category === activeNewsTab);
  };

  const displayNews = getFilteredNews().length > 0 ? getFilteredNews().slice(0,3) : NEWS.slice(0,3);

  return (
    <div className="bg-bgBlock pb-10">
      <SEO title="首页" description="长安仁爱慈善基金会官方门户网站，提供慈善项目捐赠、信息公开、新闻资讯等服务。" />
      
      {/* Hero Slider Area */}
      <HomeBanner />

      <div className="w-container mx-auto bg-white shadow-sm -mt-2 relative z-10">
        <NoticeBar />
        
        <div className="flex flex-col md:flex-row gap-8 px-6 pb-6">
          
          {/* Left Column: News Tabs */}
          <div className="flex-[2]">
            <div className="flex items-center justify-between border-b border-borderGray mb-6">
              <h2 className="text-[18px] font-bold text-textMain pb-2 border-b-2 border-primary">慈善新闻</h2>
              <div className="flex gap-4">
                {['news', 'media', 'district'].map((tab) => (
                    <button 
                      key={tab}
                      onMouseEnter={() => setActiveNewsTab(tab as any)}
                      className={`px-4 py-1 rounded-full text-sm transition-all ${activeNewsTab === tab ? 'bg-primary text-white shadow-md' : 'bg-white text-textSub hover:bg-gray-100'}`}
                    >
                      {tab === 'news' ? '慈善资讯' : tab === 'media' ? '媒体报道' : '区县动态'}
                    </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 min-h-[300px]">
              {displayNews.length > 0 ? displayNews.map((news) => (
                <div key={news.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-48 h-32 shrink-0 overflow-hidden rounded relative">
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-textMain group-hover:text-primary transition-colors">
                      <Link to={`/news/detail/${news.id}`}>{news.title}</Link>
                    </h3>
                    <p className="text-textSub text-sm line-clamp-2 mb-2 group-hover:text-textMain">{news.summary}</p>
                    <span className="text-xs text-textLight bg-bgBlock px-2 py-1 rounded">{news.date} | 来源: {news.source}</span>
                  </div>
                </div>
              )) : (
                 <div className="text-textLight py-10 text-center">暂无相关新闻</div>
              )}
            </div>
            <div className="mt-4 text-right">
              <Link to={`/news/${activeNewsTab === 'news' ? 'charity' : activeNewsTab}`} className="text-sm text-linkRed hover:text-hoverRed hover:underline flex items-center justify-end gap-1">
                查看更多 <span className="text-xs">▶</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Latest Projects */}
          <div className="flex-1">
            <div className="flex items-center justify-between border-b-2 border-borderGray mb-6">
              <h2 className="text-xl font-bold text-textMain pb-2 border-b-4 border-primary">最新项目</h2>
              <Link to="/projects" className="text-xs text-textSub hover:text-primary">更多 &gt;</Link>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="border border-borderGray p-2 hover:shadow-lg transition-all duration-300 rounded group">
                  <div className="h-32 overflow-hidden mb-2 relative rounded-sm">
                    <Link to={`/projects/${project.id}`}>
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                  </div>
                  <h4 className="font-bold text-sm mb-1 truncate text-textMain group-hover:text-primary transition-colors">
                    <Link to={`/projects/${project.id}`}>{project.title}</Link>
                  </h4>
                  <div className="text-xs text-textSub flex justify-between items-center">
                    <span>已筹: <span className="text-accent font-bold">￥{project.raised.toLocaleString()}</span></span>
                    <Link to={`/projects/${project.id}`} className="px-2 py-0.5 bg-primary text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">捐款</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Charity Projects Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-textMain border-l-4 border-primary pl-4">慈善项目</h2>
            <Link to="/projects" className="text-sm text-linkRed hover:text-hoverRed hover:underline">查看更多 &gt;&gt;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map(proj => (
              <Card 
                key={proj.id}
                title={proj.title}
                image={proj.image}
                link={`/projects/${proj.id}`}
              >
                <div className="text-xs text-textSub mb-2 grid grid-cols-2 gap-2">
                  <p>已筹金额：<span className="text-accent font-bold">￥{proj.raised.toLocaleString()}</span></p>
                  <p>爱心人次：{proj.donors}</p>
                  <p className="col-span-2">目标：{typeof proj.target === 'number' ? `￥${proj.target.toLocaleString()}` : proj.target}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="bg-bgBlock text-textSub text-xs px-2 py-1 rounded">有效期: {proj.validDate.split('至')[1]}</span>
                  <Link to={`/projects/${proj.id}`} className="bg-primary text-white text-sm px-4 py-1.5 rounded hover:bg-secondary transition-colors shadow-md hover:shadow-lg transform active:scale-95">
                    我要捐款
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Funds Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-textMain border-l-4 border-primary pl-4">公益基金</h2>
            <Link to="/funds" className="text-sm text-linkRed hover:text-hoverRed hover:underline">查看更多 &gt;&gt;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FUNDS.map(fund => (
              <div key={fund.id} className="border border-borderGray p-2 hover:shadow-xl transition-all duration-300 group relative rounded bg-white">
                <div className="overflow-hidden h-40 mb-3 rounded-sm">
                  <img src={fund.image} alt={fund.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-bold text-textMain mb-2 text-sm h-10 overflow-hidden group-hover:text-primary transition-colors">{fund.title}</h4>
                <div className="text-xs text-textSub space-y-1">
                  <p>冠名人: {fund.sponsor}</p>
                  <p>已捐善款: <span className="text-accent font-bold">￥{fund.raised.toLocaleString()}</span></p>
                </div>
                <button className="w-full mt-3 bg-white border border-primary text-primary text-sm py-1 hover:bg-primary hover:text-white transition-colors rounded-sm">
                  立即捐款
                </button>
              </div>
            ))}
          </div>
        </div>

        <DonationTable donations={DONATIONS} />
      </div>
    </div>
  );
};

export default Home;