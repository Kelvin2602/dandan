---
inclusion: always
---
# Frontend Architecture & Standards

## Core Framework
- **React 18.3.1**: Functional components với hooks
- **TypeScript**: Full type safety với strict mode
- **Vite**: Fast development server và build tool
- **React Router v6**: Client-side routing với lazy loading

## UI Framework & Styling

### Tailwind CSS v4
```typescript
// Custom Tailwind configuration
- w-container: max-width container class
- text-textSub: Secondary text color
- bg-primary: Brand primary color (#d32f2f)
- bg-secondary: Secondary brand color
- hover:bg-hoverRed: Interactive hover states
```

### Component Design Patterns
```typescript
// Consistent component structure
interface ComponentProps {
  // Required props first
  title: string;
  // Optional props với defaults
  className?: string;
  children?: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  className = '', 
  children 
}) => {
  return (
    <div className={`base-classes ${className}`}>
      {/* Component content */}
    </div>
  );
};
```

## State Management Architecture

### React Context Pattern
```typescript
// Context structure
interface ContextType {
  // State
  data: DataType[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: DataType) => Promise<void>;
  updateItem: (item: DataType) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

// Provider pattern
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management logic
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
```

### Context Hierarchy
```typescript
// App.tsx provider nesting
<HelmetProvider>
  <SiteConfigProvider>
    <DataProvider>
      <AuthProvider>
        <Router>
          {/* App content */}
        </Router>
      </AuthProvider>
    </DataProvider>
  </SiteConfigProvider>
</HelmetProvider>
```

## Component Organization

### Layout Components (`/components/Layout/`)
- **Header**: Navigation với dropdown menus, authentication status
- **Footer**: Contact info, bank details, social links
- **AdminLayout**: Protected admin interface layout
- **RightSidebar**: Fixed sidebar với quick actions

### Feature Components
```typescript
// Home page components (/components/Home/)
- HomeBanner: Carousel banner với site config integration
- NoticeBar: Scrolling announcements
- StatsGrid: Charity statistics display
- DonationTable: Recent donations list

// Shared components (/components/Shared/)
- Card: Reusable content card với hover effects
- Loading: Consistent loading states
- SEO: React Helmet integration
- ErrorBoundary: Error handling wrapper
```

## Routing Architecture

### Lazy Loading Pattern
```typescript
// All pages lazy loaded
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Suspense>
```

### Route Protection
```typescript
// Admin route protection
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};
```

## Form Handling Standards

### React Hook Form + Zod
```typescript
// Form validation schema
const schema = z.object({
  title: z.string().min(1, "标题不能为空"),
  amount: z.number().min(0, "金额必须大于0"),
  email: z.string().email("邮箱格式不正确")
});

// Form component pattern
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

### Form State Management
```typescript
// Consistent form state pattern
interface FormState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}
```

## API Integration Patterns

### Centralized API Client
```typescript
// services/api.ts structure
export const ProjectsAPI = {
  getAll: () => fetchAPI<Project[]>('/projects'),
  getById: (id: string) => fetchAPI<Project>(`/projects/${id}`),
  create: (data: ProjectFormData) => fetchAPI<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Project>) => fetchAPI<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/projects/${id}`, { method: 'DELETE' })
};
```

### Error Handling
```typescript
// Consistent error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorBody}`);
  }
  return response.json();
}
```

## Performance Optimization

### Code Splitting
- **Route-level**: All pages lazy loaded
- **Component-level**: Heavy components lazy loaded when needed
- **Bundle optimization**: Vite automatic code splitting

### Image Optimization
```typescript
// Responsive image patterns
<img 
  src={image} 
  alt={title}
  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
  loading="lazy"
/>
```

## SEO & Accessibility

### React Helmet Async
```typescript
// Page-level SEO
<Helmet>
  <title>{pageTitle} - 长安仁爱慈善基金会</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
</Helmet>
```

### Accessibility Standards
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **Keyboard Navigation**: Focus management, tab order
- **Screen Reader**: ARIA labels, alt text
- **Color Contrast**: WCAG AA compliance

## Development Guidelines
1. **Component Naming**: PascalCase cho components, camelCase cho props
2. **File Organization**: Feature-based grouping trong components/
3. **Type Safety**: Strict TypeScript, no `any` types
4. **Performance**: Lazy loading, memoization cho expensive operations
5. **Responsive Design**: Mobile-first approach với Tailwind breakpoints
6. **Error Boundaries**: Wrap components với error handling
7. **Loading States**: Consistent loading indicators
8. **Form Validation**: Client-side validation với server-side backup