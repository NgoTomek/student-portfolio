import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require authentication
export function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  
  return currentUser ? children : <Navigate to="/login" />;
}

// Component to redirect authenticated users away from auth pages
export function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  
  return currentUser ? <Navigate to="/dashboard" /> : children;
}
