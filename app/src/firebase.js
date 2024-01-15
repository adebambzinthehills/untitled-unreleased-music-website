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
  apiKey: "AIzaSyD0QhZKy44btPwFSfWxPguSmEzuKXReF-4",
  authDomain: "preview-music-player.firebaseapp.com",
  databaseURL: "https://preview-music-player-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "preview-music-player",
  storageBucket: "preview-music-player.appspot.com",
  messagingSenderId: "598900607958",
  appId: "1:598900607958:web:4ff93a064473301d3b3277",
  measurementId: "G-P1V7M26E3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default auth;