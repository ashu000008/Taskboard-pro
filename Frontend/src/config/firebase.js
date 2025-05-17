import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQnszHrf3OtbxmDB88S7Gz54Yogr8RTC8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taskboard-pro-aa57d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taskboard-pro-aa57d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taskboard-pro-aa57d.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "61091751846",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:61091751846:web:33fe2c01ab6245b7aad167",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WXMBD8L4J8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
