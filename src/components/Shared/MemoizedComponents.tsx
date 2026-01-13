import React from 'react';
import { Project, DonationRecord } from '../../types';

/**
 * Memoized components để tránh unnecessary re-renders
 * Cải thiện performance cho large lists
 */

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export const ProjectCard = React.memo<ProjectCardProps>(({ project, onEdit, onDelete }) => {
  const progressPercentage = Math.min((project.raised / project.target) * 100, 100);

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-48 object-cover rounded-t-lg"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{project.description}</p>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>已筹: ¥{project.raised.toLocaleString()}</span>
            <span>目标: ¥{project.target.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {progressPercentage.toFixed(1)}% 完成
          </div>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t">
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                编辑
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                className="flex-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              >
                删除
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

interface DonationRowProps {
  donation: DonationRecord;
  index: number;
}

export const DonationRow = React.memo<DonationRowProps>(({ donation, index }) => (
  <tr className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
    <td className="px-4 py-3 text-sm">{donation.date}</td>
    <td className="px-4 py-3 text-sm font-medium">{donation.donor}</td>
    <td className="px-4 py-3 text-sm text-accent font-bold">¥{donation.amount.toLocaleString()}</td>
    <td className="px-4 py-3 text-sm max-w-xs truncate" title={donation.projectTitle}>
      {donation.projectTitle}
    </td>
    <td className="px-4 py-3 text-sm">{donation.payType}</td>
  </tr>
));

DonationRow.displayName = 'DonationRow';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = React.memo<StatCardProps>(({ title, value, unit, icon, trend }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
        </p>
        {trend && (
          <p className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </p>
        )}
      </div>
      <div className="text-primary">
        {icon}
      </div>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';