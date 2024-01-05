// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrRSdp_suVtamrsAGSs63NX2muwGF5dXs",
  authDomain: "unreleased-music-player.firebaseapp.com",
  projectId: "unreleased-music-player",
  storageBucket: "unreleased-music-player.appspot.com",
  messagingSenderId: "240600029507",
  appId: "1:240600029507:web:49d380de0da17cba6fb7f6",
  measurementId: "G-R3JSLP5GRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);