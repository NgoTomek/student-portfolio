import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({ children, showHeader = true, showFooter = true }: LayoutProps) {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-blue-600">
                    Student Portfolio
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Home
                  </Link>
                  <Link
                    to="/portfolios"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Portfolios
                  </Link>
                  {currentUser && (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">
                      {currentUser.displayName || currentUser.email}
                    </span>
                    <button
                      onClick={logout}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>

      {showFooter && (
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Student Portfolio. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
