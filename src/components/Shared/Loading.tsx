import React from 'react';

/**
 * Loading Spinner Component
 * Hiển thị loading indicator khi đang fetch data từ API
 */
export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-textSub text-sm">加载中...</p>
      </div>
    </div>
  );
};

/**
 * Error Message Component
 * Hiển thị thông báo lỗi khi không load được data
 */
export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-textMain mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
};
