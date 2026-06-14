import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCc3ml2Gp4pHIFG6oyFCGHC4HUN00rzD40",
  authDomain: "stridewellness-2133.firebaseapp.com",
  projectId: "stridewellness-2133",
  storageBucket: "stridewellness-2133.firebasestorage.app",
  messagingSenderId: "646631884063",
  appId: "1:646631884063:web:fcc9f1e175062f69bd9c2a",
  measurementId: "G-H1J82K4NC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
