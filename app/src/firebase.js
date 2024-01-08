// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { } from 'firebase/firestore';
import { } from 'firebase/storage';
import { } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdOCKjotyHlchRNHfqhEU4XGqzrn-r5wM",
  authDomain: "spotify-preview.firebaseapp.com",
  projectId: "spotify-preview",
  storageBucket: "spotify-preview.appspot.com",
  messagingSenderId: "714672435438",
  appId: "1:714672435438:web:6a6d0f34f7993f995903ff",
  measurementId: "G-NZE067WLCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default auth;