// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅Firebase config (keep this)
const firebaseConfig = {
  apiKey: "AIzaSyADwpHKpsYMfLs0aLYaXw88nLYOLPN8wwA",
  authDomain: "tuk-mindconnect-30a98.firebaseapp.com",
  projectId: "tuk-mindconnect-30a98",
  storageBucket: "tuk-mindconnect-30a98.appspot.com", // ✅ fixed: should be .appspot.com
  messagingSenderId: "368715134707",
  appId: "1:368715134707:web:648b7858967e503b326986",
  measurementId: "G-P506D7LB09"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Export Auth and Firestore for use in the app
export const auth = getAuth(app);
export const db = getFirestore(app);
