import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllUsers } from '../../services/portfolioService';
import { useFirestoreQuery } from '../../hooks/useFirestore';

const PortfolioDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Use our custom hook to fetch all users
  const { data: users, loading, error } = useFirestoreQuery('users');
  
  // Filter users based on search term
  useEffect(() => {
    if (!users) return;
    
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.displayName?.toLowerCase().includes(lowerSearchTerm) ||
      user.school?.toLowerCase().includes(lowerSearchTerm)
    );
    
    setFilteredUsers(filtered);
  }, [users, searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Student Portfolio Directory
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:text-xl md:max-w-3xl">
              Browse and discover student portfolios from various schools and disciplines.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Find Students</h2>
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by name or school..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{user.displayName}</h3>
                  <p className="text-gray-600">{user.school}</p>
                  <p className="text-gray-500 text-sm">{user.year}</p>
                  <div className="mt-4">
                    <Link
                      to={`/portfolio/${user.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Portfolio
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No students found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDirectory;
