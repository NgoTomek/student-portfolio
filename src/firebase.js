// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXkd_HmYxWMVQnBMnHPTJ9aXZpIXfJROU",
  authDomain: "student-portfolio-caccc.firebaseapp.com",
  projectId: "student-portfolio-caccc",
  storageBucket: "student-portfolio-caccc.appspot.com",
  messagingSenderId: "417762081993",
  appId: "1:417762081993:web:3a5e5e5e5e5e5e5e5e5e5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
