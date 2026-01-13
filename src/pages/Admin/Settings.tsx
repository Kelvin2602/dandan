import { Bell, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { SEO } from '../../components/Shared/SEO';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { SiteConfig } from '../../types';

const Settings: React.FC = () => {
  const { config, updateConfig, resetConfig } = useSiteConfig();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitSuccessful },
  } = useForm<SiteConfig>({
    defaultValues: config,
  });

  const {
    fields: bannerFields,
    append: appendBanner,
    remove: removeBanner,
  } = useFieldArray({
    control,
    name: 'banners' as any,
  });

  const {
    fields: noticeFields,
    append: appendNotice,
    remove: removeNotice,
  } = useFieldArray({
    control,
    name: 'notices' as any,
  });

  // Sync form with context if config changes externally or initially
  useEffect(() => {
    reset(config);
  }, [config, reset]);

  const onSubmit = (data: SiteConfig) => {
    updateConfig(data);
    alert('设置已保存！前台页面已更新。');
  };

  const handleReset = () => {
    if (window.confirm('确定要恢复默认设置吗？所有自定义修改将丢失。')) {
      resetConfig();
    }
  };

  return (
    <div className="pb-10">
      <SEO title="系统设置" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">系统设置</h1>
        <button
          onClick={handleReset}
          className="text-red-500 text-sm flex items-center gap-1 hover:underline"
        >
          <RotateCcw size={14} /> 恢复默认
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header Settings */}
        <section className="bg-white p-6 rounded shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">顶部 Header 设置</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Banner 图片链接
              </label>
              <input
                {...register('headerImage')}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-400 mt-1">
                建议尺寸: 宽度≥1200px，高度350-400px（最大显示高度: 350px，宽度自适应100%）
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                慈善项目页 Banner 图片链接
              </label>
              <input
                {...register('projectsBanner')}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* Qualifications Settings */}
        <section className="bg-white p-6 rounded shadow-sm border-2 border-green-50">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">机构资质证书设置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">证书 1</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片链接</label>
                <input
                  {...register('qualifications.cert1')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题文本</label>
                <input
                  {...register('qualifications.title1')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">证书 2</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片链接</label>
                <input
                  {...register('qualifications.cert2')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题文本</label>
                <input
                  {...register('qualifications.title2')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Donation QR Settings */}
        <section className="bg-white p-6 rounded shadow-sm border-2 border-red-50">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">捐赠二维码设置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">二维码 1 (默认显示)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片链接</label>
                <input
                  {...register('donationQRs.qr1')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题文本</label>
                <input
                  {...register('donationQRs.title1')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">二维码 2 (可选)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片链接</label>
                <input
                  {...register('donationQRs.qr2')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题文本</label>
                <input
                  {...register('donationQRs.title2')}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notice Bar Settings - NEW SECTION */}
        <section className="bg-white p-6 rounded shadow-sm border-2 border-blue-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Bell className="text-blue-500" size={20} />
              公告栏通知设置
            </h2>
            <button
              type="button"
              onClick={() =>
                appendNotice({ id: Date.now().toString(), content: '', link: '/', icon: '📢' })
              }
              className="text-primary text-sm flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded"
            >
              <Plus size={16} /> 添加通知
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4 bg-blue-50 p-2 rounded">
            💡 提示：这些通知将在首页顶部公告栏滚动显示，自动循环播放
          </p>

          <div className="space-y-4">
            {noticeFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 p-4 rounded bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-gray-700">通知 #{index + 1}</label>
                  <button
                    type="button"
                    onClick={() => removeNotice(index)}
                    className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"
                    title="删除"
                  >
                    <Trash2 size={14} /> 删除
                  </button>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">图标</label>
                    <input
                      {...register(`notices.${index}.icon` as const)}
                      className="w-full border border-gray-300 rounded px-2 py-2 text-center focus:outline-none focus:border-primary"
                      placeholder="📢"
                      maxLength={2}
                    />
                  </div>

                  <div className="col-span-7">
                    <label className="block text-xs text-gray-600 mb-1">通知内容 *</label>
                    <input
                      {...register(`notices.${index}.content` as const)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                      placeholder="输入通知内容..."
                      required
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="block text-xs text-gray-600 mb-1">跳转链接 *</label>
                    <input
                      {...register(`notices.${index}.link` as const)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                      placeholder="/news/..."
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            {noticeFields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8 border-2 border-dashed border-gray-200 rounded">
                暂无通知，点击上方"添加通知"按钮开始添加
              </p>
            )}
          </div>
        </section>

        {/* Home Banner Settings */}
        <section className="bg-white p-6 rounded shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-gray-800">首页轮播图设置</h2>
            <button
              type="button"
              onClick={() => appendBanner('')}
              className="text-primary text-sm flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded"
            >
              <Plus size={16} /> 添加一张
            </button>
          </div>

          <div className="space-y-4">
            {bannerFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    图片 {index + 1}
                  </label>
                  <input
                    {...register(`banners.${index}` as const)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeBanner(index)}
                  className="mt-6 text-red-400 hover:text-red-600 p-2"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {bannerFields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">暂无轮播图</p>
            )}
          </div>
        </section>

        {/* Footer Settings */}
        <section className="bg-white p-6 rounded shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">页脚 Footer 信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                单位名称 (开户单位)
              </label>
              <input {...register('footer.bankUnit')} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">开户银行</label>
              <input {...register('footer.bankName')} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">银行账号</label>
              <input
                {...register('footer.bankAccount')}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
              <input {...register('footer.phone')} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
              <input {...register('footer.email')} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">办公地址</label>
              <input {...register('footer.address')} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">技术支持文字</label>
              <input
                {...register('footer.techSupport')}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t p-4 shadow-lg z-10 flex justify-end px-8">
          <button
            type="submit"
            disabled={!isDirty}
            className={`px-6 py-2 rounded text-white font-bold flex items-center gap-2 ${isDirty ? 'bg-primary hover:bg-secondary' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <Save size={18} /> 保存设置
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
