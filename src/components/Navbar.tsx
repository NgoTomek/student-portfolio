import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  protected?: boolean;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const navigation: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Leadership', href: '/leadership' },
    { name: 'Resume', href: '/resume' },
    { name: 'Contact', href: '/contact' },
    { name: 'Dashboard', href: '/dashboard', protected: true },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Student Portfolio
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map(item => {
              // Skip protected routes if user is not logged in
              if (item.protected && !currentUser) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              );
            })}
            
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map(item => {
              // Skip protected routes if user is not logged in
              if (item.protected && !currentUser) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
