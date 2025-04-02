import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  enableIndexedDbPersistence,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { handleError } from './utils/errorUtils';

/**
 * Environment validation to ensure all required variables are defined
 */
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
  console.error(errorMessage);
  
  if (process.env.NODE_ENV !== 'development') {
    throw new Error(errorMessage);
  }
}

/**
 * Firebase configuration with environment variables
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

/**
 * Firebase app and service initialization
 */
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

try {
  // Initialize the Firebase app
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Only initialize analytics in production and if supported
  if (process.env.NODE_ENV === 'production') {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(error => {
      console.warn('Analytics not supported:', error);
    });
  }

  // Set up emulators for local development
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATORS === 'true') {
    // Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099');
    // Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    // Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log('Connected to Firebase emulators');
  }

  // Enable offline persistence for Firestore
  enableIndexedDbPersistence(db).catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn(
        'Multiple tabs open, persistence can only be enabled in one tab at a time.'
      );
    } else if (err.code === 'unimplemented') {
      console.warn(
        'The current browser does not support all of the features required to enable persistence.'
      );
    } else {
      console.error('Persistence error:', err);
    }
  });

} catch (error) {
  console.error('Firebase initialization error:', error);
  handleError(error, 'Firebase initialization failed');
  
  // Initialize with empty objects to prevent crashes
  // This will keep the app from crashing if Firebase fails to initialize
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
}

// Export the Firebase services
export { app, auth, db, storage, analytics };

// Export a function to check if Firebase is properly initialized
export const isFirebaseInitialized = (): boolean => {
  return !!app && !!auth && !!db && !!storage;
};
