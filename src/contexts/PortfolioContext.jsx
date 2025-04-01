import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

// Create the portfolio data context
const PortfolioContext = createContext();

// Custom hook to use the portfolio context
export function usePortfolio() {
  return useContext(PortfolioContext);
}

// Provider component that makes portfolio data available throughout the app
export function PortfolioProvider({ children }) {
  const { currentUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!currentUser) {
        setPortfolioData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const portfolioDocRef = doc(db, "portfolios", currentUser.uid);
        const portfolioDoc = await getDoc(portfolioDocRef);
        
        if (portfolioDoc.exists()) {
          setPortfolioData(portfolioDoc.data());
        } else {
          console.log("No portfolio data found for this user");
          setPortfolioData(null);
        }
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [currentUser]);

  // Refresh portfolio data function
  const refreshPortfolioData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const portfolioDocRef = doc(db, "portfolios", currentUser.uid);
      const portfolioDoc = await getDoc(portfolioDocRef);
      
      if (portfolioDoc.exists()) {
        setPortfolioData(portfolioDoc.data());
      } else {
        setPortfolioData(null);
      }
    } catch (err) {
      console.error("Error refreshing portfolio data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    portfolioData,
    loading,
    error,
    refreshPortfolioData
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}
