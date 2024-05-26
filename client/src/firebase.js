// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-joshi.firebaseapp.com",
  projectId: "mern-auth-joshi",
  storageBucket: "mern-auth-joshi.appspot.com",
  messagingSenderId: "337342804907",
  appId: "1:337342804907:web:5022dd996d565d21a4d8ee",
  measurementId: "G-MH9WDK3JYT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
