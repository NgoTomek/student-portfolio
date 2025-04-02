import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { NetworkStatus } from '../components/NetworkStatus';

const DashboardLayout: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">You need to be logged in to access the dashboard</h2>
          <Button 
            onClick={() => navigate('/login')}
            variant="primary"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="bg-white w-64 hidden md:block shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Student Portfolio
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {userProfile?.displayName || currentUser?.email}
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a 
                href="/dashboard" 
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Overview
              </a>
            </li>
            <li>
              <a 
                href="/dashboard/personal-info" 
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Personal Info
              </a>
            </li>
            <li>
              <a 
                href="/dashboard/projects" 
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="/dashboard/leadership" 
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Leadership
              </a>
            </li>
            <li>
              <a 
                href="/dashboard/skills" 
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="/dashboard/contact" 
                className="block px-4 py-2 rounded hover:bg-gray-100"
              >
                Contact
              </a>
            </li>
          </ul>

          <div className="border-t border-gray-200 mt-6 pt-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              
              {!isOnline && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-1 rounded-full text-sm">
                  Offline Mode
                </div>
              )}
              
              <Button 
                onClick={handleLogout}
                variant="secondary"
                size="sm"
                className="hidden md:block"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              <NetworkStatus />
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
