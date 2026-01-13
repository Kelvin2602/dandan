import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * Centralized loading states để consistent UX
 * Thay thế các loading spinners rời rạc
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

interface PageLoadingProps {
  text?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ text = '加载中...' }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

interface TableLoadingProps {
  rows?: number;
  columns?: number;
}

export const TableLoading: React.FC<TableLoadingProps> = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="flex-1 h-4 bg-gray-200 rounded" />
        ))}
      </div>
    ))}
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = '加载失败',
  onRetry,
  className = ''
}) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
    <AlertCircle className="text-red-500 mb-4" size={48} />
    <h3 className="text-lg font-semibold text-gray-800 mb-2">出现错误</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
      >
        重新加载
      </button>
    )}
  </div>
);

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description,
  action,
  className = ''
}) => (
  <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <div className="w-8 h-8 bg-gray-300 rounded" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    {action}
  </div>
);