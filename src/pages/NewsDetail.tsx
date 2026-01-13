import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { SEO } from '../components/Shared/SEO';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { news: allNews } = useData();
  const news = allNews.find((n) => String(n.id) === id);

  if (!news)
    return (
      <div className="p-20 text-center">
        <SEO title="文章不存在" />
        文章不存在
      </div>
    );

  return (
    <div className="bg-white py-8 min-h-screen">
      <SEO title={news.title} description={news.summary} />
      <div className="w-container mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-2">
          <Link to="/" className="hover:text-primary">
            首页
          </Link>{' '}
          &gt;
          <Link to="/news" className="hover:text-primary">
            {' '}
            新闻中心
          </Link>{' '}
          &gt;
          <span className="text-gray-800"> 正文</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{news.title}</h1>
          <div className="flex justify-center gap-6 text-sm text-gray-500 mb-8 bg-gray-50 py-2 rounded">
            <span>发布时间：{news.date}</span>
            <span>来源：{news.source}</span>
            <span>浏览次数：1,234</span>
          </div>

          <div className="prose max-w-none text-lg leading-loose text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: news.content || news.summary }}></div>
            {news.image && (
              <div className="my-6 text-center">
                <img
                  src={news.image}
                  alt={news.title}
                  className="max-w-full h-auto mx-auto rounded shadow"
                />
                <p className="text-sm text-gray-500 mt-2">（图：活动现场）</p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between">
            <Link to="/news" className="text-gray-600 hover:text-primary">
              {' '}
              &lt; 返回列表
            </Link>
            <button className="text-gray-600 hover:text-primary">分享本文</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
