import { create } from 'zustand';
import { PortfolioData } from '../types';

interface PortfolioStore {
  portfolioData: PortfolioData | null;
  loading: boolean;
  error: string | null;
  setPortfolioData: (data: PortfolioData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updatePortfolioData: (data: Partial<PortfolioData>) => void;
  reset: () => void;
}

const initialState = {
  portfolioData: null,
  loading: false,
  error: null,
};

export const usePortfolioStore = create<PortfolioStore>(set => ({
  ...initialState,
  setPortfolioData: data => set({ portfolioData: data, error: null }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  updatePortfolioData: data =>
    set(state => ({
      portfolioData: state.portfolioData ? { ...state.portfolioData, ...data } : null,
      error: null,
    })),
  reset: () => set(initialState),
}));
