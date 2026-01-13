import React, { Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Navigate, Route, HashRouter as Router, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';

import AdminLayout from './components/Layout/AdminLayout';
import Footer from './components/Layout/Footer';
import Header from './components/Layout/Header';
import { RightSidebar } from './components/Layout/RightSidebar';

// Lazy Load Pages - Public
const Home = React.lazy(() => import('./pages/Home'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const TransactionList = React.lazy(() => import('./pages/TransactionList'));
const NewsList = React.lazy(() => import('./pages/NewsList'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const FundsList = React.lazy(() => import('./pages/FundsList'));
const About = React.lazy(() => import('./pages/About'));
const Volunteer = React.lazy(() => import('./pages/Volunteer'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

// Lazy Load Pages - Admin
const AdminLogin = React.lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = React.lazy(() => import('./pages/Admin/Dashboard'));
const AdminProjectManager = React.lazy(() => import('./pages/Admin/ProjectManager'));
const AdminNewsManager = React.lazy(() => import('./pages/Admin/NewsManager'));
const AdminSettings = React.lazy(() => import('./pages/Admin/Settings'));
const AdminDonationManager = React.lazy(() => import('./pages/Admin/DonationManager'));
const AdminVolunteerManager = React.lazy(() => import('./pages/Admin/VolunteerManager'));

// Loading Fallback Component
const LoadingSpinner = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Wrapper for Public Pages (Header + Footer)
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <Header />
      <main className="grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/info/transactions" element={<TransactionList />} />
            <Route
              path="/info/download"
              element={<div className="p-20 text-center text-gray-500">暂无资料下载</div>}
            />
            <Route
              path="/info/*"
              element={<div className="p-20 text-center text-gray-500">此栏目正在建设中...</div>}
            />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:category" element={<NewsList />} />
            <Route path="/news/detail/:id" element={<NewsDetail />} />
            <Route path="/funds" element={<FundsList />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/about" element={<About />} />
            <Route path="/stories" element={<NewsList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {/* Fixed Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <SiteConfigProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Admin Routes */}
                <Route
                  path="/admin/login"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminLogin />
                    </Suspense>
                  }
                />

                {/* Public Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Register />
                    </Suspense>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="projects"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminProjectManager />
                      </Suspense>
                    }
                  />
                  <Route
                    path="news"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminNewsManager />
                      </Suspense>
                    }
                  />
                  <Route
                    path="donations"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminDonationManager />
                      </Suspense>
                    }
                  />
                  <Route
                    path="volunteers"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminVolunteerManager />
                      </Suspense>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminSettings />
                      </Suspense>
                    }
                  />
                  <Route
                    path="*"
                    element={<div className="p-10 text-gray-500">功能开发中...</div>}
                  />
                </Route>

                {/* Public Routes */}
                <Route path="/*" element={<PublicLayout />} />
              </Routes>
            </Router>
          </DataProvider>
        </AuthProvider>
      </SiteConfigProvider>
    </HelmetProvider>
  );
};

export default App;
