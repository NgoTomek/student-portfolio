import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { fetchDocument, fetchCollection, updateDocument } from './firestoreService';
import { showErrorToast, showInfoToast } from '../components/Toast';
import { auth } from '../firebase';
import { saveToCache, getFromCache } from './cacheService';
import { handleError } from '../utils/errorHandler';

// Cache keys
const PORTFOLIO_CACHE_KEY = 'portfolio_';
const PROFILE_CACHE_KEY = 'profile_';
const USERS_CACHE_KEY = 'users';

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    // Try to get from local storage cache first
    const cachedData = getFromCache(USERS_CACHE_KEY);

    try {
      // Attempt to fetch fresh data
      const freshData = await fetchCollection('users', [where('isPublished', '==', true)]);

      if (freshData && freshData.length > 0) {
        // Update cache with fresh data
        saveToCache(USERS_CACHE_KEY, freshData);
        return freshData;
      } else if (cachedData) {
        // If we have cached data but couldn't get fresh data
        showInfoToast('Using previously cached directory. Some information may be outdated.');
        return cachedData;
      }

      return [];
    } catch (error) {
      // If offline or error, try to return cached data
      if (cachedData) {
        showInfoToast('You appear to be offline. Using cached directory.');
        return cachedData;
      }
      throw error;
    }
  } catch (error) {
    handleError(error, 'Failed to load users directory');
    throw new Error(`Failed to load users: ${error.message}`);
  }
};

// Fetch a specific user's portfolio
export const fetchUserPortfolio = async userId => {
  try {
    // Try to get from local storage cache first
    const cachedData = getFromCache(`${PORTFOLIO_CACHE_KEY}${userId}`);

    try {
      // Always attempt to fetch fresh data
      const freshData = await fetchDocument('portfolios', userId);

      if (freshData) {
        // Update cache with fresh data
        saveToCache(`${PORTFOLIO_CACHE_KEY}${userId}`, freshData);
        return freshData;
      } else if (cachedData) {
        // If we have cached data but couldn't get fresh data (document no longer exists)
        console.warn('Using cached portfolio data for userId:', userId);
        showInfoToast('Using previously cached data. Some information may be outdated.');
        return { ...cachedData, _fromCache: true };
      }

      return null; // No data found
    } catch (error) {
      // If offline or error, try to return cached data
      if (cachedData) {
        console.warn('Using cached portfolio data due to error:', error.message);
        showInfoToast('You appear to be offline. Using cached data.');
        return { ...cachedData, _fromCache: true };
      }
      throw error;
    }
  } catch (error) {
    handleError(error, 'Failed to load portfolio data');
    throw new Error(`Failed to load portfolio data: ${error.message}`);
  }
};

// Fetch a specific user's profile
export const fetchUserProfile = async userId => {
  try {
    // Try to get from local storage cache first
    const cachedData = getFromCache(`${PROFILE_CACHE_KEY}${userId}`);

    try {
      // Attempt to fetch fresh data
      const freshData = await fetchDocument('users', userId);

      if (freshData) {
        // Update cache with fresh data
        saveToCache(`${PROFILE_CACHE_KEY}${userId}`, freshData);
        return freshData;
      } else if (cachedData) {
        // If we have cached data but couldn't get fresh data
        showInfoToast('Using previously cached user data. Some information may be outdated.');
        return { ...cachedData, _fromCache: true };
      }

      return null;
    } catch (error) {
      // If offline or error, try to return cached data
      if (cachedData) {
        showInfoToast('You appear to be offline. Using cached user data.');
        return { ...cachedData, _fromCache: true };
      }
      throw error;
    }
  } catch (error) {
    handleError(error, 'Failed to load user profile');
    throw new Error(`Failed to load user profile: ${error.message}`);
  }
};

// Fetch portfolios by school
export const fetchPortfoliosBySchool = async schoolName => {
  try {
    // First get users from that school
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('school', '==', schoolName));
    const usersSnapshot = await getDocs(q);

    // Then fetch their portfolios
    const userIds = usersSnapshot.docs.map(doc => doc.id);
    const portfolios = [];

    for (const userId of userIds) {
      const portfolio = await fetchUserPortfolio(userId);
      if (portfolio) {
        portfolios.push(portfolio);
      }
    }

    return portfolios;
  } catch (error) {
    console.error('Error fetching portfolios by school:', error);
    throw error;
  }
};

// Search portfolios by keyword
export const searchPortfolios = async keyword => {
  try {
    // This is a simplified search implementation
    // In a real app, you might use Firestore's array-contains or Firebase Extensions like Search
    const portfoliosCollection = collection(db, 'portfolios');
    const portfoliosSnapshot = await getDocs(portfoliosCollection);

    const results = [];
    const lowerKeyword = keyword.toLowerCase();

    for (const doc of portfoliosSnapshot.docs) {
      const data = doc.data();

      // Check personal info
      if (
        data.personalInfo &&
        (data.personalInfo.name?.toLowerCase().includes(lowerKeyword) ||
          data.personalInfo.bio?.toLowerCase().includes(lowerKeyword) ||
          data.personalInfo.school?.toLowerCase().includes(lowerKeyword))
      ) {
        results.push({
          id: doc.id,
          ...data,
        });
        continue;
      }

      // Check projects
      if (
        data.projects &&
        data.projects.some(
          project =>
            project.title?.toLowerCase().includes(lowerKeyword) ||
            project.description?.toLowerCase().includes(lowerKeyword)
        )
      ) {
        results.push({
          id: doc.id,
          ...data,
        });
        continue;
      }

      // Check leadership
      if (
        data.leadership &&
        data.leadership.some(
          item =>
            item.title?.toLowerCase().includes(lowerKeyword) ||
            item.organization?.toLowerCase().includes(lowerKeyword) ||
            item.description?.toLowerCase().includes(lowerKeyword)
        )
      ) {
        results.push({
          id: doc.id,
          ...data,
        });
        continue;
      }

      // Check skills
      if (
        data.skills &&
        data.skills.some(skill => skill.name?.toLowerCase().includes(lowerKeyword))
      ) {
        results.push({
          id: doc.id,
          ...data,
        });
        continue;
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching portfolios:', error);
    throw error;
  }
};

/**
 * Update a specific section of the current user's portfolio
 */
export const updatePortfolioSection = async (section, data) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in');

    await updateDocument('portfolios', user.uid, { [section]: data });

    // Update cache
    const cachedData = getFromCache(`${PORTFOLIO_CACHE_KEY}${user.uid}`);
    if (cachedData) {
      saveToCache(`${PORTFOLIO_CACHE_KEY}${user.uid}`, {
        ...cachedData,
        [section]: data,
        lastUpdated: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    handleError(error, `Failed to update ${section}`);
    throw error;
  }
};
