export interface NavItem {
  id: string;
  label: string;
  path: string;
  children?: NavItem[];
}

export interface Project {
  id: string;
  title: string;
  image: string;
  raised: number;
  target: number; // Standardized to number for calculations
  donors: number;
  validDate: string; // Format: YYYY-MM-DD
  description: string;
  content?: string; // HTML content for detail page
  category?: string;
  status: 'fundraising' | 'completed' | 'pending'; // Consistent với backend
  createdAt?: string;
  updatedAt?: string;
}

// Form data type cho project creation/editing
export interface ProjectFormData extends Omit<
  Project,
  'id' | 'raised' | 'donors' | 'createdAt' | 'updatedAt'
> {
  raised?: number; // Optional cho new projects
  donors?: number; // Optional cho new projects
}

export interface Fund {
  id: string;
  title: string;
  image: string;
  sponsor: string;
  raised: number;
  times: number;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  image?: string;
  summary: string;
  content?: string; // HTML content
  source: string;
  category: 'charity' | 'media' | 'district'; // Added for filtering
}

export interface DonationRecord {
  id: string;
  date: string;
  donor: string;
  amount: number;
  projectTitle: string;
  payType: string;
  channel: string;
}

export interface Volunteer {
  id: number;
  name: string;
  phone: string;
  email: string;
  area: string;
  interest: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface StatMetric {
  label: string;
  value: string | number;
  unit?: string;
  iconType: 'money' | 'out' | 'people';
}

// Interface cho thông báo chạy (Notice Bar)
export interface NoticeItem {
  id: string;
  content: string;
  link: string;
  icon?: string; // Emoji hoặc icon, mặc định: 📢
}

// API Response types để type-safe API calls
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Auth API Response types
export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    username: string;
    role: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    username: string;
    role: string;
  };
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: {
    username: string;
    role: string;
  };
}

// Form state types
export interface FormState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface SiteConfig {
  header: {
    title: string;
    logo: string;
  };
  footer: {
    contact: string;
    copyright: string;
    bankUnit?: string;
    bankName?: string;
    bankAccount?: string;
    phone?: string;
    email?: string;
    address?: string;
    techSupport?: string;
  };
  baseStats: {
    raised: number;
    donors: number;
    projects: number;
    volunteers: number;
  };
  banners: string[]; // Home page banners
  notices: Notice[];
  headerImage?: string; // Global header background
  projectsBanner?: string; // Projects page specific banner
  navigation: NavItem[]; // Navigation menu items
  qualifications?: {
    cert1: string; // Legal Person Registration Certificate
    title1: string;
    cert2: string; // Public Fundraising Qualification Certificate
    title2: string;
  };
  donationQRs?: {
    qr1: string;
    title1: string;
    qr2: string;
    title2: string;
  };
}
