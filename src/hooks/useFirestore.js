import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

// Custom hook for fetching data from Firestore
export const useFirestoreQuery = (
  collectionName,
  constraints = [],
  orderByField = null,
  orderDirection = 'desc',
  limitCount = null
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const constraintsString = JSON.stringify(constraints);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const collectionRef = collection(db, collectionName);

        // Build query with constraints
        let queryRef = collectionRef;
        if (constraints.length > 0) {
          queryRef = query(collectionRef, ...constraints);
        }

        // Add orderBy if specified
        if (orderByField) {
          queryRef = query(queryRef, orderBy(orderByField, orderDirection));
        }

        // Add limit if specified
        if (limitCount) {
          queryRef = query(queryRef, limit(limitCount));
        }

        const snapshot = await getDocs(queryRef);
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(fetchedData);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, constraintsString, orderByField, orderDirection, limitCount]);

  return { data, loading, error };
};

// Custom hook for real-time updates (for future implementation)
export const useFirestoreRealtime = (collectionName, constraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const constraintsString = JSON.stringify(constraints);

  useEffect(() => {
    // This would use onSnapshot for real-time updates
    // For now, we'll just use the regular query hook
    const fetchData = async () => {
      try {
        setLoading(true);
        const collectionRef = collection(db, collectionName);

        // Build query with constraints
        let queryRef = collectionRef;
        if (constraints.length > 0) {
          queryRef = query(collectionRef, ...constraints);
        }

        const snapshot = await getDocs(queryRef);
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(fetchedData);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, constraintsString]);

  return { data, loading, error };
};

// Helper function to create Firestore where constraints
export const createWhereConstraint = (field, operator, value) => {
  return where(field, operator, value);
};
