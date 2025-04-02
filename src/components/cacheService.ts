/**
 * Enhanced Cache Service
 * 
 * A more secure and flexible caching solution using localStorage with:
 * - Encryption for sensitive data (optional)
 * - Proper type safety with TypeScript
 * - Expiration handling
 * - Size limitations
 * - Serialization/deserialization
 */

import { isObject } from '../utils/typeUtils';

// Cache item interface with metadata
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number | null;
  version: string;
  encrypted?: boolean;
}

// CacheService configuration
interface CacheConfig {
  prefix: string;         // Prefix for all cache keys
  defaultExpiry: number;  // Default expiry time in milliseconds
  version: string;        // Version identifier for cache entries
  maxItems: number;       // Maximum number of items to store
  encryptSensitive: boolean; // Whether to encrypt sensitive data
}

// Default config values
const DEFAULT_CONFIG: CacheConfig = {
  prefix: 'student_portfolio_',
  defaultExpiry: 24 * 60 * 60 * 1000, // 24 hours
  version: '1.0.0',
  maxItems: 100,
  encryptSensitive: false, // Set to true if you implement encryption
};

/**
 * Enhanced Cache Service for secure client-side caching
 */
export class CacheService {
  private config: CacheConfig;
  private storage: Storage;
  private isStorageAvailable: boolean;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.storage = window.localStorage;
    this.isStorageAvailable = this.checkStorageAvailability();
  }

  /**
   * Check if localStorage is available
   */
  private checkStorageAvailability(): boolean {
    try {
      const testKey = `${this.config.prefix}__test`;
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage is not available. Caching will be disabled.');
      return false;
    }
  }

  /**
   * Create a prefixed key
   */
  private getKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  /**
   * Encrypt sensitive data (placeholder - implement proper encryption if needed)
   */
  private encryptData<T>(data: T): string {
    if (!this.config.encryptSensitive) {
      return JSON.stringify(data);
    }
    
    // IMPORTANT: Replace this with actual encryption if enabled
    // This is just a placeholder for demonstration
    const serialized = JSON.stringify(data);
    return btoa(serialized); // Base64 is NOT encryption! Just a placeholder
  }

  /**
   * Decrypt sensitive data (placeholder - implement proper decryption if needed)
   */
  private decryptData<T>(data: string, encrypted: boolean): T | null {
    try {
      if (!encrypted) {
        return JSON.parse(data);
      }
      
      // IMPORTANT: Replace this with actual decryption if enabled
      // This is just a placeholder for demonstration
      const decoded = atob(data); // Base64 is NOT encryption! Just a placeholder
      return JSON.parse(decoded);
    } catch (e) {
      console.warn('Failed to decrypt/parse cached data:', e);
      return null;
    }
  }

  /**
   * Save data to cache
   */
  public save<T>(
    key: string, 
    data: T, 
    options: { 
      expiry?: number | null; 
      sensitive?: boolean;
    } = {}
  ): boolean {
    if (!this.isStorageAvailable) return false;
    
    try {
      // Handle maximum items limit
      if (this.getCount() >= this.config.maxItems) {
        this.removeOldest();
      }
      
      const isSensitive = options.sensitive ?? false;
      const expiryTime = options.expiry !== undefined ? options.expiry : this.config.defaultExpiry;
      
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: expiryTime,
        version: this.config.version,
        encrypted: isSensitive && this.config.encryptSensitive,
      };
      
      // Serialize data
      const serializedData = isSensitive && this.config.encryptSensitive 
        ? this.encryptData(cacheItem.data) 
        : JSON.stringify(cacheItem.data);
      
      // Create the stored value
      const storedValue = JSON.stringify({
        ...cacheItem,
        data: serializedData,
      });
      
      this.storage.setItem(this.getKey(key), storedValue);
      return true;
    } catch (e) {
      console.warn('Failed to save to cache:', e);
      
      // If quota exceeded, try to make space
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        this.clearOldItems();
        
        // Try again after clearing
        try {
          this.save(key, data, options);
          return true;
        } catch {
          return false;
        }
      }
      
      return false;
    }
  }

  /**
   * Get data from cache
   */
  public get<T>(key: string): T | null {
    if (!this.isStorageAvailable) return null;
    
    try {
      const storedItem = this.storage.getItem(this.getKey(key));
      if (!storedItem) return null;
      
      const parsedItem = JSON.parse(storedItem) as Omit<CacheItem<string>, 'data'> & { data: string };
      
      // Check version - if different, invalidate cache
      if (parsedItem.version !== this.config.version) {
        this.remove(key);
        return null;
      }
      
      // Check expiry
      if (parsedItem.expiry !== null) {
        const expiryTime = parsedItem.timestamp + parsedItem.expiry;
        if (Date.now() > expiryTime) {
          this.remove(key);
          return null;
        }
      }
      
      // Deserialize/decrypt the data
      return this.decryptData<T>(parsedItem.data, !!parsedItem.encrypted);
    } catch (e) {
      console.warn('Failed to get from cache:', e);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  public remove(key: string): boolean {
    if (!this.isStorageAvailable) return false;
    
    try {
      this.storage.removeItem(this.getKey(key));
      return true;
    } catch (e) {
      console.warn('Failed to remove from cache:', e);
      return false;
    }
  }

  /**
   * Clear all cached data for this application
   */
  public clear(): boolean {
    if (!this.isStorageAvailable) return false;
    
    try {
      // Only clear keys with our prefix
      const keys = this.getAllKeys();
      keys.forEach(key => this.storage.removeItem(key));
      return true;
    } catch (e) {
      console.warn('Failed to clear cache:', e);
      return false;
    }
  }

  /**
   * Get all cache keys
   */
  private getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.config.prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get the count of cached items
   */
  private getCount(): number {
    return this.getAllKeys().length;
  }

  /**
   * Remove the oldest cache item
   */
  private removeOldest(): void {
    try {
      const keys = this.getAllKeys();
      if (keys.length === 0) return;
      
      let oldestKey = keys[0];
      let oldestTime = Date.now();
      
      // Find the oldest item
      for (const key of keys) {
        try {
          const item = this.storage.getItem(key);
          if (!item) continue;
          
          const parsed = JSON.parse(item);
          if (isObject(parsed) && 'timestamp' in parsed && typeof parsed.timestamp === 'number') {
            if (parsed.timestamp < oldestTime) {
              oldestTime = parsed.timestamp;
              oldestKey = key;
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      // Remove the oldest item
      this.storage.removeItem(oldestKey);
    } catch (e) {
      console.warn('Failed to remove oldest cache item:', e);
    }
  }

  /**
   * Clear expired and old items to make space
   */
  private clearOldItems(): void {
    try {
      const keys = this.getAllKeys();
      const now = Date.now();
      
      // First pass: remove expired items
      for (const key of keys) {
        try {
          const item = this.storage.getItem(key);
          if (!item) continue;
          
          const parsed = JSON.parse(item);
          if (
            isObject(parsed) && 
            'timestamp' in parsed && 
            'expiry' in parsed && 
            typeof parsed.timestamp === 'number' && 
            (parsed.expiry === null || typeof parsed.expiry === 'number')
          ) {
            if (parsed.expiry !== null && (parsed.timestamp + parsed.expiry < now)) {
              this.storage.removeItem(key);
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      // Second pass: remove oldest items until we're at 75% capacity
      while (this.getCount() > this.config.maxItems * 0.75) {
        this.removeOldest();
      }
    } catch (e) {
      console.warn('Failed to clear old cache items:', e);
    }
  }
  
  /**
   * Check if a key exists in the cache
   */
  public has(key: string): boolean {
    if (!this.isStorageAvailable) return false;
    return this.storage.getItem(this.getKey(key)) !== null;
  }
  
  /**
   * Get item metadata without retrieving full data
   */
  public getItemInfo(key: string): { timestamp: number; expiry: number | null } | null {
    if (!this.isStorageAvailable) return null;
    
    try {
      const storedItem = this.storage.getItem(this.getKey(key));
      if (!storedItem) return null;
      
      const parsed = JSON.parse(storedItem);
      if (isObject(parsed) && 'timestamp' in parsed && 'expiry' in parsed) {
        return {
          timestamp: parsed.timestamp,
          expiry: parsed.expiry,
        };
      }
      
      return null;
    } catch (e) {
      return null;
    }
  }
}

// Create and export a default instance
export const cacheService = new CacheService();

// Named exports for specific functions for convenience
export const saveToCache = <T>(key: string, data: T, options?: { expiry?: number; sensitive?: boolean }) => 
  cacheService.save(key, data, options);

export const getFromCache = <T>(key: string) => 
  cacheService.get<T>(key);

export const removeFromCache = (key: string) => 
  cacheService.remove(key);

export const clearCache = () => 
  cacheService.clear();
