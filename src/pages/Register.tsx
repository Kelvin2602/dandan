import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/Shared/SEO';

const Register: React.FC = () => {
  const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const password = watch("password");

  const onSubmit = async (data: any) => {
    try {
      const result = await registerUser({ username: data.username, password: data.password });

      if (result.success) {
        // Optional: Auto login or redirect to login
        navigate('/login');
        // You could also toast a success message here if you had a toast notification system
        alert('注册成功，请登录！');
      } else {
        setError('root', { type: 'manual', message: result.message || '注册失败' });
      }
    } catch (e) {
      console.error(e);
      setError('root', { type: 'manual', message: '系统错误，请联系管理员' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <SEO title="会员注册" />
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">会员注册</h1>
          <p className="text-gray-500 text-sm">加入长善，共筑爱心</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded border border-red-100">
              {errors.root.message as string}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              {...register('username', { 
                required: '请输入用户名',
                minLength: { value: 3, message: '用户名至少3个字符' }
              })}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="设置您的用户名"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              {...register('password', { 
                required: '请输入密码', 
                minLength: { value: 6, message: '密码至少6个字符' }
              })}
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="设置密码"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <input
              {...register('confirmPassword', { 
                required: '请确认密码', 
                validate: value => value === password || "两次输入的密码不一致"
              })}
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="确认密码"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '注册中...' : '立即注册'}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            已有账号？ 
            <Link to="/login" className="text-primary hover:underline ml-1">立即登录</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
