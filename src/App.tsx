// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { PrivateRoute, PublicRoute, AdminRoute } from './components/ProtectedRoutes';
import { NetworkStatus } from './components/NetworkStatus';
import { Toast } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Public Pages
import Home from './pages/Home/Home';
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'));
const PublicPortfolio = lazy(() => import('./pages/Public/PublicPortfolio'));
const PortfolioDirectory = lazy(() => import('./pages/Public/PortfolioDirectory'));

// Dashboard Pages
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/Dashboard/DashboardHome'));
const PersonalInfoEdit = lazy(() => import('./pages/Dashboard/PersonalInfoEdit'));
const ProjectsEdit = lazy(() => import('./pages/Dashboard/ProjectsEdit'));
const LeadershipEdit = lazy(() => import('./pages/Dashboard/LeadershipEdit'));
const SkillsEdit = lazy(() => import('./pages/Dashboard/SkillsEdit'));
const ContactEdit = lazy(() => import('./pages/Dashboard/ContactEdit'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));

// Error Pages
const NotFound = lazy(() => import('./pages/Errors/NotFound'));
const Unauthorized = lazy(() => import('./pages/Errors/Unauthorized'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <PortfolioProvider>
            <Toast />
            <NetworkStatus />
            <Suspense 
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="large" />
                </div>
              }
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/verify-email"
                  element={
                    <PrivateRoute>
                      <VerifyEmail />
                    </PrivateRoute>
                  }
                />
                <Route path="/portfolios" element={<PortfolioDirectory />} />
                <Route path="/portfolio/:userId" element={<PublicPortfolio />} />

                {/* Dashboard Routes - Requires Authentication */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute emailVerificationRequired={true}>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="personal-info" element={<PersonalInfoEdit />} />
                  <Route path="projects" element={<ProjectsEdit />} />
                  <Route path="leadership" element={<LeadershipEdit />} />
                  <Route path="skills" element={<SkillsEdit />} />
                  <Route path="contact" element={<ContactEdit />} />
                </Route>

                {/* Admin Routes - Requires Admin Role */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <DashboardLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                </Route>

                {/* Error Routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/not-found" element={<NotFound />} />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Routes>
            </Suspense>
          </PortfolioProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
