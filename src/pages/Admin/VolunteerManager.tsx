import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Phone, Mail, Download } from 'lucide-react';
import { SEO } from '../../components/Shared/SEO';
import { useData } from '../../contexts/DataContext';
import { ExportService } from '../../services/exportService';

const VolunteerManager: React.FC = () => {
    const { volunteers, updateVolunteerStatus } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = volunteers.filter(v => v.name.includes(searchTerm) || v.phone.includes(searchTerm));

    const handleExport = () => {
        const exportData = filtered.map(v => ({
            'ID': v.id,
            '姓名': v.name,
            '手机号': v.phone,
            '邮箱': v.email,
            '意向区域': v.area,
            '服务意向': v.interest,
            '申请日期': v.date,
            '状态': v.status === 'approved' ? '已通过' : v.status === 'rejected' ? '已拒绝' : '待审核'
        }));

        const fileName = `志愿者名单_${new Date().toISOString().split('T')[0]}`;
        ExportService.exportToExcel(exportData, fileName, '志愿者');
    };

    return (
        <div>
            <SEO title="志愿者管理" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">志愿者申请审核</h1>
                <button
                    onClick={handleExport}
                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                >
                    <Download size={18} /> 导出 Excel
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded shadow-sm mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="搜索姓名或手机号..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid View for Applicants */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(v => (
                    <div key={v.id} className="bg-white p-6 rounded shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{v.name}</h3>
                                <span className="text-xs text-gray-500">申请日期: {v.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    v.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {v.status === 'approved' ? '已通过' : v.status === 'rejected' ? '已拒绝' : '待审核'}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                            <p className="flex items-center gap-2"><Phone size={14} /> {v.phone}</p>
                            <p className="flex items-center gap-2"><Mail size={14} /> {v.email}</p>
                            <p><strong>区域:</strong> {v.area}</p>
                            <p><strong>意向:</strong> {v.interest}</p>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                            {v.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => updateVolunteerStatus(v.id, 'approved')}
                                        className="flex-1 bg-green-50 text-green-600 py-2 rounded hover:bg-green-100 flex items-center justify-center gap-1 text-sm font-bold"
                                    >
                                        <CheckCircle size={16} /> 通过
                                    </button>
                                    <button
                                        onClick={() => updateVolunteerStatus(v.id, 'rejected')}
                                        className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 flex items-center justify-center gap-1 text-sm font-bold"
                                    >
                                        <XCircle size={16} /> 拒绝
                                    </button>
                                </>
                            )}
                            {v.status !== 'pending' && (
                                <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded text-sm cursor-not-allowed">
                                    审核已完成
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolunteerManager;