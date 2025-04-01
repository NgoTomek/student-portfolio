import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        if (!currentUser) return;
        
        const portfolioDocRef = doc(db, "portfolios", currentUser.uid);
        const portfolioDoc = await getDoc(portfolioDocRef);
        
        if (portfolioDoc.exists()) {
          setPortfolioData(portfolioDoc.data());
        } else {
          setError("Portfolio data not found. Please contact support.");
        }
      } catch (err) {
        setError("Failed to load portfolio data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Your Portfolio Dashboard</h2>
        <p className="text-gray-600 mb-4">
          This is your personal dashboard where you can manage and update your student portfolio. 
          Use the sidebar navigation to access different sections of your portfolio.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">Quick Tips</h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Keep your personal information up to date</li>
              <li>Add new projects as you complete them</li>
              <li>Update your skills as you learn new things</li>
              <li>Add leadership roles and extracurricular activities</li>
              <li>Make sure your contact information is current</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2">Portfolio Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Projects:</span>
                <span className="font-medium">{portfolioData?.projects?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Leadership Roles:</span>
                <span className="font-medium">{portfolioData?.leadership?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Skills:</span>
                <span className="font-medium">{portfolioData?.skills?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Last Updated:</span>
                <span className="font-medium">
                  {portfolioData?.lastUpdated ? new Date(portfolioData.lastUpdated).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-2">Personal Info</h3>
          <p className="text-gray-600 mb-4">Update your name, school, year, bio, and motivational quote.</p>
          <a href="/dashboard/personal-info" className="text-blue-600 hover:text-blue-800 font-medium">Edit Personal Info →</a>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-2">Projects</h3>
          <p className="text-gray-600 mb-4">Manage your academic projects, EPQ, and coding work.</p>
          <a href="/dashboard/projects" className="text-blue-600 hover:text-blue-800 font-medium">Edit Projects →</a>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-2">Leadership</h3>
          <p className="text-gray-600 mb-4">Update your leadership roles and extracurricular activities.</p>
          <a href="/dashboard/leadership" className="text-blue-600 hover:text-blue-800 font-medium">Edit Leadership →</a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
