import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1500;

/**
 * Helper function to wait for a specified time
 */
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch a document with retry logic
 */
export const fetchDocument = async (collectionPath, docId) => {
  let attempts = 0;
  let lastError = null;

  while (attempts < MAX_RETRIES) {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null; // Document doesn't exist
      }
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempts + 1} failed:`, error.message);
      // Check if it's due to being offline
      if (error.message.includes('offline')) {
        if (navigator.onLine) {
          // Browser reports online, but Firebase is having issues
          // Wait longer and retry
          await wait(RETRY_DELAY * 2);
        } else {
          // Truly offline - break out of loop
          break;
        }
      } else {
        // Other error - wait and retry
        await wait(RETRY_DELAY);
      }
      attempts++;
    }
  }

  throw lastError;
};

/**
 * Fetch a collection with retry logic
 */
export const fetchCollection = async (collectionPath, constraints = []) => {
  let attempts = 0;
  let lastError = null;

  while (attempts < MAX_RETRIES) {
    try {
      const collectionRef = collection(db, collectionPath);
      let queryRef = collectionRef;

      if (constraints.length > 0) {
        queryRef = query(collectionRef, ...constraints);
      }

      const snapshot = await getDocs(queryRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempts + 1} failed:`, error.message);

      if (error.message.includes('offline')) {
        if (navigator.onLine) {
          await wait(RETRY_DELAY * 2);
        } else {
          break;
        }
      } else {
        await wait(RETRY_DELAY);
      }
      attempts++;
    }
  }

  throw lastError;
};

/**
 * Update a document with retry logic
 */
export const updateDocument = async (collectionPath, docId, data) => {
  let attempts = 0;
  let lastError = null;

  while (attempts < MAX_RETRIES) {
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, { ...data, lastUpdated: new Date().toISOString() });
      return true;
    } catch (error) {
      lastError = error;
      console.warn(`Update attempt ${attempts + 1} failed:`, error.message);

      if (error.message.includes('offline')) {
        if (navigator.onLine) {
          await wait(RETRY_DELAY * 2);
        } else {
          break;
        }
      } else {
        await wait(RETRY_DELAY);
      }
      attempts++;
    }
  }

  throw lastError;
};
