// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCErrNeI7GYkbJXxSHUoQZJ-0UFXzwtxuY",
  authDomain: "smart-parking-system-181d0.firebaseapp.com",
  projectId: "smart-parking-system-181d0",
  storageBucket: "smart-parking-system-181d0.appspot.com",
  messagingSenderId: "116238149294",
  appId: "1:116238149294:web:760a046bf879e12328af3f",
  measurementId: "G-EZL7WX322P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);
export default app;