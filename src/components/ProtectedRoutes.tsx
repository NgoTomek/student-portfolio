import React, { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectPath?: string;
  adminOnly?: boolean;
  emailVerificationRequired?: boolean;
}

/**
 * PrivateRoute component for protecting routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const PrivateRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
  adminOnly = false,
  emailVerificationRequired = false,
}) => {
  const { currentUser, loading, initializing, isAdmin } = useAuth();
  const location = useLocation();

  // Handle loading state
  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    // Redirect to login with return URL
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }

  // Check if admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if email verification is required
  if (
    emailVerificationRequired &&
    !currentUser.emailVerified &&
    location.pathname !== '/verify-email'
  ) {
    return <Navigate to="/verify-email" replace />;
  }

  // Return children or outlet
  return children ? <>{children}</> : <Outlet />;
};

/**
 * PublicRoute component for routes that should redirect authenticated users elsewhere
 * For example, login/register pages that should redirect to dashboard if already logged in
 */
export const PublicRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/dashboard',
}) => {
  const { currentUser, loading, initializing } = useAuth();
  
  // Handle loading state
  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect authenticated users
  if (currentUser) {
    return <Navigate to={redirectPath} replace />;
  }

  // Return children or outlet for anonymous users
  return children ? <>{children}</> : <Outlet />;
};

/**
 * AdminRoute component for protecting routes that require admin privileges
 */
export const AdminRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/dashboard',
}) => {
  const { currentUser, isAdmin, loading, initializing } = useAuth();
  
  // Handle loading state
  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check if user is authenticated and an admin
  if (!currentUser || !isAdmin) {
    return <Navigate to={redirectPath} replace />;
  }

  // Return children or outlet for admin users
  return children ? <>{children}</> : <Outlet />;
};

/**
 * EmailVerifiedRoute component for protecting routes that require email verification
 */
export const EmailVerifiedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/verify-email',
}) => {
  const { currentUser, loading, initializing } = useAuth();
  
  // Handle loading state
  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check if user is authenticated and email is verified
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!currentUser.emailVerified) {
    return <Navigate to={redirectPath} replace />;
  }

  // Return children or outlet for verified users
  return children ? <>{children}</> : <Outlet />;
};
