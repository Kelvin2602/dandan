import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SEO } from '../components/Shared/SEO';
import { useData } from '../contexts/DataContext';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, donations, addDonation } = useData();
  const project = projects.find((p) => String(p.id) === id);
  const [donateAmount, setDonateAmount] = useState<string>('10');
  const [isDonating, setIsDonating] = useState(false);

  if (!project) {
    return (
      <div className="p-20 text-center">
        <SEO title="项目不存在" />
        项目不存在
      </div>
    );
  }

  const percent =
    typeof project.target === 'number'
      ? Math.min(100, (project.raised / project.target) * 100).toFixed(1)
      : '0';

  const handleDonate = async () => {
    if (!donateAmount || Number(donateAmount) <= 0) {
      alert('请输入有效的捐赠金额');
      return;
    }

    setIsDonating(true);

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    addDonation({
      donor: '热心网友', // Default name for quick donation
      amount: Number(donateAmount),
      projectTitle: project.title,
      payType: '微信支付',
      channel: '官网PC端',
    });

    setIsDonating(false);
    alert(`感谢您的善心！成功捐赠 ${donateAmount} 元。\n数据已同步至后台及公示列表。`);
    setDonateAmount('');
  };

  // Filter donations for this specific project if needed, or show all top donations
  // For this design, let's show global donations to show activity
  const recentDonations = donations.slice(0, 15);

  return (
    <div className="bg-bgBlock min-h-screen py-8">
      <SEO title={project.title} description={project.description} />
      <div className="w-container mx-auto">
        {/* Breadcrumb */}
        <div className="text-[12px] text-textSub mb-4">
          <Link to="/" className="hover:text-primary">
            首页
          </Link>{' '}
          &gt;
          <Link to="/projects" className="hover:text-primary">
            {' '}
            慈善项目
          </Link>{' '}
          &gt;
          <span className="text-gray-800"> 项目详情</span>
        </div>

        {/* Top Info Section */}
        <div className="bg-white p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[480px] shrink-0 h-[320px] overflow-hidden rounded relative border border-gray-100">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div
              className={`absolute top-0 right-0 px-3 py-1 text-white text-xs ${project.status === 'fundraising' ? 'bg-primary' : 'bg-gray-500'}`}
            >
              {project.status === 'fundraising' ? '募捐中' : '已结束'}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-2">
            <div>
              <h1 className="text-2xl font-bold text-textMain mb-4 leading-tight">
                {project.title}
              </h1>
              <div className="bg-[#f9f9f9] p-4 rounded mb-6 border border-gray-100 text-[13px] text-textSub space-y-2">
                <p>
                  募捐备案编号：<span className="text-gray-800">51610100573539824XA21008</span>
                </p>
                <p>
                  项目有效期：<span className="text-gray-800">{project.validDate}</span>
                </p>
                <p>
                  项目类别：
                  <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                    {project.category || '综合'}
                  </span>
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-3xl font-bold text-accent font-sans">
                      ￥{project.raised.toLocaleString()}
                    </span>
                    <span className="text-xs text-textSub ml-2">已筹金额</span>
                  </div>
                  <span className="text-xs text-textSub">
                    目标：
                    {typeof project.target === 'number'
                      ? `￥${project.target.toLocaleString()}`
                      : project.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-accent to-yellow-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[12px] text-textLight mt-2">
                  <span>
                    当前进度: <span className="text-accent">{percent}%</span>
                  </span>
                  <span>
                    <span className="text-textMain font-bold">{project.donors}</span> 人次参与捐款
                  </span>
                </div>
              </div>
            </div>

            {/* Donation Action */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex border-2 border-primary rounded overflow-hidden h-10">
                <span className="bg-gray-50 px-3 flex items-center text-gray-500 border-r border-gray-200 text-sm font-bold">
                  ￥
                </span>
                <input
                  type="number"
                  className="w-32 px-3 focus:outline-none font-bold text-gray-700"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  disabled={isDonating || project.status !== 'fundraising'}
                />
              </div>
              <button
                className={`flex-1 text-white h-10 rounded text-[16px] font-bold shadow-md transform active:scale-95 transition-all tracking-wider ${isDonating || project.status !== 'fundraising' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'}`}
                onClick={handleDonate}
                disabled={isDonating || project.status !== 'fundraising'}
              >
                {isDonating
                  ? '处理中...'
                  : project.status !== 'fundraising'
                    ? '项目已结束'
                    : '立即捐款'}
              </button>
              <button className="border border-gray-300 text-gray-600 h-10 px-4 rounded hover:bg-gray-50 text-sm">
                分享
              </button>
            </div>
          </div>
        </div>

        {/* Content & Records Tabs */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-[3] bg-white p-8 shadow-sm min-h-[400px]">
            <div className="border-b border-gray-200 mb-6">
              <span className="inline-block border-t-2 border-primary py-3 px-6 bg-white text-primary font-bold -mt-px text-lg">
                项目详情
              </span>
              <span className="inline-block py-3 px-6 text-gray-500 hover:text-gray-800 cursor-pointer text-lg">
                项目进展
              </span>
            </div>

            <div
              className="prose max-w-none text-textMain leading-loose text-[14px]"
              dangerouslySetInnerHTML={{ __html: project.content || project.description }}
            ></div>

            <div className="mt-10 bg-orange-50 border border-orange-100 p-4 text-[13px] text-orange-800 rounded">
              <h4 className="font-bold mb-1 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center text-xs">
                  !
                </span>
                温馨提示：
              </h4>
              <p className="opacity-90">
                长安仁爱慈善基金会承诺：您的每一笔捐款都将用于该公益项目，我们将定期公示项目进展和资金使用情况。若项目执行完毕后仍有剩余善款，将用于同类其他慈善项目。
              </p>
            </div>
          </div>

          <div className="flex-1 bg-white p-5 shadow-sm h-fit">
            <h3 className="text-lg font-bold border-l-4 border-primary pl-3 mb-5 text-textMain">
              爱心捐赠榜
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {recentDonations.map((d, i) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between text-sm border-b border-dashed border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${project.status === 'fundraising' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {project.status === 'fundraising' ? '募捐中' : '已结束'}
                    </span>
                    <div>
                      <p className="font-bold text-gray-700">{d.donor}</p>
                      <p className="text-[10px] text-gray-400">{d.date}</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold">￥{d.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
