import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorMessage, Loading } from '../components/Shared/Loading';
import { useData } from '../contexts/DataContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const Projects: React.FC = () => {
  const { config } = useSiteConfig();
  const { projects, loading, error, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProjects = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory; // Simplified category logic
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-white py-8 min-h-screen">
      <div className="w-container mx-auto">
        {/* Banner */}
        {/* Banner */}
        <div
          className="w-full h-[220px] bg-gray-200 mb-8 flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url('${config.projectsBanner || 'https://picsum.photos/1200/400'}')`,
          }}
        >
          <h1 className="text-4xl text-white font-bold drop-shadow-md">慈善项目</h1>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refreshData} />
        ) : (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
              <ul className="flex gap-6 text-sm font-medium text-gray-600 mb-4 md:mb-0">
                <li
                  className={`cursor-pointer pb-1 ${filterCategory === 'all' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
                  onClick={() => setFilterCategory('all')}
                >
                  全部
                </li>
                <li
                  className={`cursor-pointer pb-1 ${filterCategory === 'aid' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
                  onClick={() => setFilterCategory('aid')}
                >
                  扶贫济困
                </li>
                <li
                  className={`cursor-pointer pb-1 ${filterCategory === 'education' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
                  onClick={() => setFilterCategory('education')}
                >
                  助学支教
                </li>
                <li
                  className={`cursor-pointer pb-1 ${filterCategory === 'medical' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
                  onClick={() => setFilterCategory('medical')}
                >
                  医疗救助
                </li>
                <li
                  className={`cursor-pointer pb-1 ${filterCategory === 'activity' ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`}
                  onClick={() => setFilterCategory('activity')}
                >
                  公益活动
                </li>
              </ul>
              <div className="flex">
                <input
                  type="text"
                  placeholder="请输入关键字"
                  className="border border-gray-300 px-3 py-1.5 text-sm rounded-l focus:outline-none focus:border-primary w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-primary text-white px-4 py-1.5 text-sm rounded-r hover:bg-secondary">
                  查找
                </button>
              </div>
            </div>

            {/* Project Grid */}
            {filteredProjects.length > 0 ? (
              <div className="space-y-6">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6 group"
                  >
                    <div className="w-full md:w-[320px] h-[200px] shrink-0 overflow-hidden rounded relative">
                      <Link to={`/projects/${proj.id}`}>
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors cursor-pointer">
                          <Link to={`/projects/${proj.id}`}>{proj.title}</Link>
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <p>
                            已筹金额：
                            <span className="text-accent text-lg font-bold">
                              ￥{proj.raised.toLocaleString()}
                            </span>
                          </p>
                          <p>爱心人次：{proj.donors}</p>
                          <p>
                            目标：
                            {typeof proj.target === 'number'
                              ? `￥${proj.target.toLocaleString()}`
                              : proj.target}
                          </p>
                          <p>有效期：{proj.validDate}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-500 leading-relaxed mb-4">
                          {proj.description}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button className="px-6 py-2 bg-gray-200 text-gray-600 rounded text-sm cursor-not-allowed">
                          分享
                        </button>
                        <Link
                          to={`/projects/${proj.id}`}
                          className="px-6 py-2 bg-primary text-white rounded text-sm hover:bg-secondary shadow-md transition-all"
                        >
                          我要捐款
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">暂无相关项目</div>
            )}

            {/* Pagination Mock */}
            <div className="flex justify-center mt-10 gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-400">
                上一页
              </button>
              <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-400">
                下一页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
