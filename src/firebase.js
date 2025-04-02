// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyCoE7kKmLTBmeaE4cSUdNLqacFqemFYrGo',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'student-portfolio-caccc.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'student-portfolio-caccc',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'student-portfolio-caccc.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '417762081993',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:417762081993:web:5b833fe0519354fde8a118',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-NK41G5JX9T'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    }
  });

export { auth, db, storage, analytics };
