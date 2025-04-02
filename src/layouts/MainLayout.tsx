import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NetworkStatus } from '../components/NetworkStatus';
import { Toast } from '../components/Toast';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toast />
      <NetworkStatus />
      <Navbar />
      
      <main className="flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
