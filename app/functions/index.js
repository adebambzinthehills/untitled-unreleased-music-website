/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const admin = require("firebase-admin");

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

admin.initializeApp(firebaseConfig);

const bucket = admin.storage().bucket();
exports.deleteFolder = async () => {
    await bucket.deleteFiles({
    prefix: `images/users/${uid}`  // the path of the folder
    });
}