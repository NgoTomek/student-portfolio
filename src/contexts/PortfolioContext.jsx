import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { PortfolioData } from '../types';
import { showErrorToast } from '../components/Toast';

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refreshPortfolioData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

interface PortfolioProviderProps {
  children: ReactNode;
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const { currentUser } = useAuth();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!currentUser) {
        setPortfolioData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);
        const portfolioDoc = await getDoc(portfolioDocRef);

        if (portfolioDoc.exists()) {
          setPortfolioData(portfolioDoc.data() as PortfolioData);
        } else {
          console.log('No portfolio data found for this user');
          setPortfolioData(null);
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching portfolio data');
        showErrorToast(`Failed to load portfolio data: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      setError(null);
      
      const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);
      const portfolioDoc = await getDoc(portfolioDocRef);

      if (portfolioDoc.exists()) {
        setPortfolioData(portfolioDoc.data() as PortfolioData);
      } else {
        setPortfolioData(null);
      }
    } catch (err) {
      console.error('Error refreshing portfolio data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while refreshing portfolio data');
      showErrorToast(`Failed to refresh portfolio data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Get public portfolios
  const getPublicPortfolios = async () => {
    try {
      setLoading(true);
      
      const portfoliosRef = collection(db, 'portfolios');
      const q = query(portfoliosRef, where('isPublished', '==', true));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error('Error fetching public portfolios:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    portfolioData,
    loading,
    error,
    refreshPortfolioData,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}
