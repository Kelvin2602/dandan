import { Loader, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

// Constants
import { API_CONFIG, ERROR_MESSAGES, UPLOAD_LIMITS } from '../../constants';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.type && !UPLOAD_LIMITS.ALLOWED_TYPES.includes(file.type as any)) {
      return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }
    
    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
      return ERROR_MESSAGES.FILE_TOO_LARGE;
    }
    
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(API_CONFIG.UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.url) {
        // Ensure full URL for cross-port access
        const fullUrl = data.url.startsWith('http') ? data.url : `http://localhost:3001${data.url}`;
        onChange(fullUrl);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(ERROR_MESSAGES.UPLOAD_FAILED);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-4">
        {value ? (
            <div className="relative w-32 h-32 border border-gray-200 rounded overflow-hidden group">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={handleRemove}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                    <X size={14} />
                </button>
            </div>
        ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                {isUploading ? <Loader className="animate-spin" /> : <Upload size={24} />}
                <span className="text-xs mt-2">{isUploading ? '上传中...' : '上传图片'}</span>
            </div>
        )}
        
        <div className="flex-1">
            <input 
              type="file" 
              accept={UPLOAD_LIMITS.ALLOWED_EXTENSIONS.join(',')}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              支持 {UPLOAD_LIMITS.ALLOWED_EXTENSIONS.join(', ')}. 最大 {Math.round(UPLOAD_LIMITS.MAX_FILE_SIZE / 1024 / 1024)}MB.
            </p>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};
