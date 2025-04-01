// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoE7kKmLTBmeaE4cSUdNLqacFqemFYrGo",
  authDomain: "student-portfolio-caccc.firebaseapp.com",
  projectId: "student-portfolio-caccc",
  storageBucket: "student-portfolio-caccc.firebasestorage.app",
  messagingSenderId: "417762081993",
  appId: "1:417762081993:web:5b833fe0519354fde8a118",
  measurementId: "G-NK41G5JX9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };
