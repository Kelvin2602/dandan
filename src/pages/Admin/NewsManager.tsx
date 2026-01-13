import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SEO } from '../../components/Shared/SEO';
import { useData } from '../../contexts/DataContext';
import { NewsItem } from '../../types';

const NewsManager: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NewsItem>();

  const openModal = (item?: NewsItem) => {
    if (item) {
      setEditingItem(item);
      setValue('title', item.title);
      setValue('date', item.date);
      setValue('summary', item.summary);
      setValue('content', item.content);
      setValue('source', item.source);
      setValue('category', item.category);
      setValue('image', item.image);
    } else {
      setEditingItem(null);
      reset({
        title: '',
        date: new Date().toISOString().split('T')[0],
        summary: '',
        content: '',
        source: '西安市慈善会',
        category: 'charity', // default
        image: 'https://picsum.photos/800/600?random=' + Math.floor(Math.random() * 100)
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
        if (editingItem) {
          await updateNews({ 
            ...editingItem, 
            ...data 
          });
        } else {
          await addNews({
            ...data,
            id: Date.now().toString(),
          });
        }
        closeModal();
    } catch (error) {
        console.error("Failed to save news:", error);
        alert("保存失败，请重试");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这条新闻吗？')) {
      try {
          await deleteNews(id);
      } catch (error) {
          console.error("Failed to delete news:", error);
          alert("删除失败，请重试");
      }
    }
  };

  const filtered = news.filter(n => n.title.includes(searchTerm));

  const getCategoryLabel = (cat: string) => {
      switch(cat) {
          case 'charity': return '慈善要闻';
          case 'media': return '媒体报道';
          case 'district': return '区县动态';
          default: return cat;
      }
  };

  return (
    <div>
      <SEO title="新闻管理" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">新闻管理</h1>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary"
        >
            <Plus size={18} /> 发布新闻
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="搜索新闻标题..." 
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
                    <th className="p-4 border-b">标题</th>
                    <th className="p-4 border-b">分类</th>
                    <th className="p-4 border-b">日期</th>
                    <th className="p-4 border-b">来源</th>
                    <th className="p-4 border-b">操作</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 border-b last:border-0">
                        <td className="p-4">
                            {item.image && <img src={item.image} alt="" className="w-12 h-12 object-cover rounded" />}
                        </td>
                        <td className="p-4 font-medium max-w-xs truncate" title={item.title}>{item.title}</td>
                        <td className="p-4">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {getCategoryLabel(item.category)}
                            </span>
                        </td>
                        <td className="p-4">{item.date}</td>
                        <td className="p-4 text-gray-500">{item.source}</td>
                        <td className="p-4">
                            <div className="flex gap-2">
                                <button 
                                  onClick={() => openModal(item)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
                                  title="编辑"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    className="p-1 text-red-600 hover:bg-red-50 rounded" 
                                    title="删除"
                                    onClick={() => handleDelete(item.id)}
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
            <div className="p-10 text-center text-gray-400">暂无新闻数据</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingItem ? '编辑新闻' : '发布新闻'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">新闻标题</label>
                <input 
                  {...register('title', { required: '标题不能为空' })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                />
                {errors.title && <span className="text-red-500 text-xs">请输入标题</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">发布日期</label>
                    <input 
                      type="date"
                      {...register('date', { required: true })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">来源</label>
                    <input 
                      {...register('source')}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">分类</label>
                <select 
                  {...register('category')} 
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="charity">慈善要闻</option>
                  <option value="media">媒体报道</option>
                  <option value="district">区县动态</option>
                </select>
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
                 <label className="block text-sm font-bold text-gray-700 mb-1">摘要</label>
                 <textarea 
                    {...register('summary', { required: true })}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-20 focus:outline-none focus:border-primary"
                 ></textarea>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">内容 (支持HTML)</label>
                 <textarea 
                    {...register('content')}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-32 focus:outline-none focus:border-primary font-mono text-sm"
                    placeholder="<p>输入新闻内容...</p>"
                 ></textarea>
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
                  {editingItem ? '保存修改' : '立即发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
