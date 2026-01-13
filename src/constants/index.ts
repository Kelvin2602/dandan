// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  UPLOAD_URL: 'http://localhost:3001/api/upload',
  TIMEOUT: 10000, // 10 seconds
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

// UI Constants
export const UI_CONFIG = {
  HEADER_HEIGHT: 396, // px
  NAV_HEIGHT: 40, // px
  CONTAINER_MAX_WIDTH: 1200, // px
  ANIMATION_DURATION: 300, // ms
} as const;

// Form Validation
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_CONTENT_LENGTH: 10000,
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PAGINATION_LIMIT: 20,
  DONATION_LIMIT: 100,
  NEWS_LIMIT: 10,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络后重试',
  UPLOAD_FAILED: '文件上传失败，请重试',
  INVALID_FILE_TYPE: '不支持的文件类型',
  FILE_TOO_LARGE: '文件大小超出限制',
  REQUIRED_FIELD: '此字段为必填项',
  INVALID_EMAIL: '邮箱格式不正确',
  PASSWORD_TOO_SHORT: '密码长度至少6位',
} as const;

// Success Messages  
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存成功！',
  UPLOAD_SUCCESS: '上传成功！',
  DELETE_SUCCESS: '删除成功！',
  UPDATE_SUCCESS: '更新成功！',
} as const;