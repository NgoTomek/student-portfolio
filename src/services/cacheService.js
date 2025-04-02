/**
 * Simple cache service using localStorage for persistent caching
 */

const CACHE_PREFIX = 'student_portfolio_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Save data to cache
 */
export const saveToCache = (key, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
    return true;
  } catch (error) {
    console.warn('Failed to save to cache:', error);
    return false;
  }
};

/**
 * Get data from cache
 */
export const getFromCache = (key) => {
  try {
    const cacheItem = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cacheItem) return null;
    
    const { data, timestamp } = JSON.parse(cacheItem);
    
    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to get from cache:', error);
    return null;
  }
};

/**
 * Remove item from cache
 */
export const removeFromCache = (key) => {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.warn('Failed to remove from cache:', error);
    return false;
  }
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  try {
    // Only clear keys with our prefix
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.warn('Failed to clear cache:', error);
    return false;
  }
}; 