import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SEO } from '../../components/Shared/SEO';
import { useData } from '../../contexts/DataContext';
import { Project } from '../../types';

const ProjectManager: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Project>();

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setValue('title', project.title);
      setValue('target', project.target);
      setValue('validDate', project.validDate);
      setValue('description', project.description);
      setValue('image', project.image);
      setValue('status', project.status);
    } else {
      setEditingProject(null);
      reset({
        title: '',
        target: 0,
        validDate: '',
        description: '',
        image: 'https://picsum.photos/800/600?random=' + Math.floor(Math.random() * 100),
        status: 'fundraising'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    reset();
  };

  const onSubmit = (data: any) => {
    if (editingProject) {
      updateProject({ 
        ...editingProject, 
        ...data, 
        target: Number(data.target) || data.target 
      });
    } else {
      addProject({
        ...data,
        id: Date.now().toString(),
        raised: 0,
        donors: 0,
        target: Number(data.target) || data.target
      });
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个项目吗？')) {
      deleteProject(id);
    }
  };

  const filtered = projects.filter(p => p.title.includes(searchTerm));

  return (
    <div>
      <SEO title="项目管理" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">项目管理</h1>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary"
        >
            <Plus size={18} /> 发布新项目
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="搜索项目名称..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 font-bold text-sm">
                <tr>
                    <th className="p-4 border-b">缩略图</th>
                    <th className="p-4 border-b">项目名称</th>
                    <th className="p-4 border-b">目标金额</th>
                    <th className="p-4 border-b">已筹金额</th>
                    <th className="p-4 border-b">状态</th>
                    <th className="p-4 border-b">操作</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 border-b last:border-0">
                        <td className="p-4">
                            <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />
                        </td>
                        <td className="p-4 font-medium max-w-xs truncate" title={p.title}>{p.title}</td>
                        <td className="p-4">￥{typeof p.target === 'number' ? p.target.toLocaleString() : p.target}</td>
                        <td className="p-4 text-accent font-bold">￥{p.raised.toLocaleString()}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs ${p.status === 'fundraising' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {p.status === 'fundraising' ? '募捐中' : '已结束'}
                            </span>
                        </td>
                        <td className="p-4">
                            <div className="flex gap-2">
                                <button 
                                  onClick={() => openModal(p)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
                                  title="编辑"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    className="p-1 text-red-600 hover:bg-red-50 rounded" 
                                    title="删除"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {filtered.length === 0 && (
            <div className="p-10 text-center text-gray-400">未找到相关项目</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingProject ? '编辑项目' : '发布新项目'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">项目名称</label>
                <input 
                  {...register('title', { required: '项目名称不能为空' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                />
                {errors.title && <span className="text-red-500 text-xs">请输入项目名称</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">目标金额 (元)</label>
                   <input 
                      type="number"
                      {...register('target', { required: true })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">有效期</label>
                   <input 
                      {...register('validDate', { required: true })}
                      placeholder="YYYY-MM-DD 至 YYYY-MM-DD"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">封面图片 URL</label>
                <input 
                  {...register('image')}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">项目简介</label>
                 <textarea 
                    {...register('description', { required: true })}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:border-primary"
                 ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">状态</label>
                <select 
                  {...register('status')} 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="fundraising">募捐中 (Fundraising)</option>
                  <option value="completed">已结束 (Completed)</option>
                  <option value="pending">待审核 (Pending)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary"
                >
                  {editingProject ? '保存修改' : '立即发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;