import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SEO } from '../components/Shared/SEO';
import { useData } from '../contexts/DataContext';

// 1. Define Schema using Zod
const volunteerSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的11位手机号码'),
  email: z.string().email('请输入有效的电子邮箱地址'),
  area: z.string().min(1, '请选择所在区域'),
  interests: z.array(z.string()).min(1, '请至少选择一项志愿服务意向'),
  bio: z.string().min(10, '个人简介至少需要10个字符').max(500, '个人简介不能超过500字'),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

const Volunteer: React.FC = () => {
  const { addVolunteer } = useData();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      interests: [],
    },
  });

  const onSubmit = async (data: VolunteerFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add to context
    addVolunteer({
      name: data.name,
      phone: data.phone,
      email: data.email,
      area: data.area,
      interest: data.interests.join(', '),
    });

    console.log('Form Data Submitted:', data);
    alert('提交成功！我们会尽快联系您。请在管理后台查看您的申请。');
    reset();
  };

  return (
    <div className="bg-white py-12 min-h-screen">
      <SEO title="志愿服务" description="加入长安仁爱慈善基金会志愿者行列，一起传递温暖。" />
      <div className="w-container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">加入志愿者行列</h1>
          <p className="text-gray-500">予人玫瑰，手有余香。加入我们，一起传递温暖。</p>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className={`w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className={`w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                电子邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                className={`w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                所在区域 <span className="text-red-500">*</span>
              </label>
              <select
                {...register('area')}
                className={`w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary ${errors.area ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">请选择...</option>
                <option value="xincheng">新城区</option>
                <option value="beilin">碑林区</option>
                <option value="lianhu">莲湖区</option>
                <option value="yanta">雁塔区</option>
                <option value="weiyang">未央区</option>
              </select>
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                志愿服务意向 (至少选一项) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 flex-wrap">
                {['扶老助残', '社区服务', '环保公益', '支教助学', '紧急救援'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" value={item} {...register('interests')} />
                    {item}
                  </label>
                ))}
              </div>
              {errors.interests && (
                <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                个人简介 / 技能特长 <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('bio')}
                className={`w-full border p-2 rounded h-32 focus:outline-none focus:ring-1 focus:ring-primary ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
              ></textarea>
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary text-white py-3 rounded font-bold shadow-lg transition-colors flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  提交中...
                </span>
              ) : (
                '提交申请'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
