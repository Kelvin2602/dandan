import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const NewsList: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { news } = useData();

  const getCategoryTitle = (cat?: string) => {
    switch (cat) {
      case 'charity':
        return '慈善资讯';
      case 'media':
        return '媒体报道';
      case 'district':
        return '区县动态';
      default:
        return '新闻中心';
    }
  };

  const filteredNews = category ? news.filter((n) => n.category === category) : news;

  return (
    <div className="bg-bgBlock py-8 min-h-screen">
      <div className="w-container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Menu - Matching About Page Style */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white mb-6">
              <h2 className="text-xl font-normal text-primary p-4 border-b border-gray-200 flex items-center tracking-wide">
                <span className="mr-2 text-lg">→</span> 新闻中心
              </h2>
              <ul className="text-sm text-gray-600">
                <li className="border-b border-gray-100 last:border-0">
                  <Link
                    to="/news/charity"
                    className={`block py-3 px-8 transition-colors text-center ${category === 'charity' ? 'bg-[#f47f7c] text-white' : 'hover:text-primary hover:bg-gray-50'}`}
                  >
                    慈善资讯
                  </Link>
                </li>
                <li className="border-b border-gray-100 last:border-0">
                  <Link
                    to="/news/media"
                    className={`block py-3 px-8 transition-colors text-center ${category === 'media' ? 'bg-[#f47f7c] text-white' : 'hover:text-primary hover:bg-gray-50'}`}
                  >
                    媒体报道
                  </Link>
                </li>
                <li className="border-b border-gray-100 last:border-0">
                  <Link
                    to="/news/district"
                    className={`block py-3 px-8 transition-colors text-center ${category === 'district' ? 'bg-[#f47f7c] text-white' : 'hover:text-primary hover:bg-gray-50'}`}
                  >
                    区县动态
                  </Link>
                </li>
              </ul>
            </div>

            {/* QR Code Reuse */}
            <div className="p-4 text-center bg-white hidden md:block">
              <img
                src="https://res-img.n.gongyibao.cn/uploads/1dbdc970-d95e-45a8-859b-86e4e9abe89e/20210825/248ac00189d845b09a8470fd7cf8e806.png"
                alt="WeChat"
                className="w-32 h-32 mx-auto mb-2 border border-gray-200 p-1"
              />
              <p className="text-xs text-gray-600">扫码关注官方微信</p>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 bg-white p-6 min-h-[600px]">
            {/* Page Title */}
            <div className="border-b border-gray-200 pb-3 mb-6">
              <h1 className="text-2xl font-normal text-gray-800 tracking-wide">
                {getCategoryTitle(category)}
              </h1>
            </div>

            <ul className="space-y-6">
              {filteredNews.map((news) => (
                <li
                  key={news.id}
                  className="flex flex-col md:flex-row gap-4 border-b border-dashed border-gray-200 pb-6 group cursor-pointer"
                >
                  <div className="w-full md:w-56 h-36 shrink-0 overflow-hidden relative">
                    <Link to={`/news/detail/${news.id}`}>
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-textMain mb-2 group-hover:text-primary transition-colors">
                        <Link to={`/news/detail/${news.id}`}>{news.title}</Link>
                      </h3>
                      <p className="text-textSub text-[13px] leading-6 line-clamp-2 mb-2">
                        {news.summary}
                      </p>
                    </div>
                    <div className="text-xs text-textLight flex justify-between items-center bg-gray-50 px-2 py-1 rounded">
                      <span>来源：{news.source}</span>
                      <span>{news.date}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {filteredNews.length === 0 && (
              <div className="text-center py-20 text-gray-400">暂无相关内容</div>
            )}

            {/* Mock Pagination */}
            {filteredNews.length > 0 && (
              <div className="mt-10 flex justify-center gap-2">
                <button className="px-3 py-1 border border-gray-200 text-gray-500 text-xs hover:border-primary hover:text-primary">
                  首页
                </button>
                <button className="px-3 py-1 bg-primary text-white border border-primary text-xs">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-200 text-gray-500 text-xs hover:border-primary hover:text-primary">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-200 text-gray-500 text-xs hover:border-primary hover:text-primary">
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsList;
