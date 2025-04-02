import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { PrivateRoute, PublicRoute } from './components/ProtectedRoutes';
import { NetworkStatus } from './components/NetworkStatus';
import { Toast } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PublicPortfolio from './pages/Public/PublicPortfolio';
import PortfolioDirectory from './pages/Public/PortfolioDirectory';

// Dashboard Pages
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import PersonalInfoEdit from './pages/Dashboard/PersonalInfoEdit';
import ProjectsEdit from './pages/Dashboard/ProjectsEdit';
import LeadershipEdit from './pages/Dashboard/LeadershipEdit';
import SkillsEdit from './pages/Dashboard/SkillsEdit';
import ContactEdit from './pages/Dashboard/ContactEdit';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <PortfolioProvider>
            <Toast />
            <NetworkStatus />
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
              <Route path="/portfolios" element={<PortfolioDirectory />} />
              <Route path="/portfolio/:userId" element={<PublicPortfolio />} />

              {/* Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
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

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PortfolioProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
