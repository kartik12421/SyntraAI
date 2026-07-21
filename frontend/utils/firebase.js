// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "syntraai-8ac9b.firebaseapp.com",
  projectId: "syntraai-8ac9b",
  storageBucket: "syntraai-8ac9b.firebasestorage.app",
  messagingSenderId: "567930019566",
  appId: "1:567930019566:web:b1097c7c4e1d741f4e9dff",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
