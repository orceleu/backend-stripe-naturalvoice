const { initializeApp, getApp, getApps } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyBPIc-g0fXX_xIqyWe-0t39ilStHrHPAtU",
  authDomain: "natural-voice-28245.firebaseapp.com",
  projectId: "natural-voice-28245",
  storageBucket: "natural-voice-28245.appspot.com",
  messagingSenderId: "345122734687",
  appId: "1:345122734687:web:99e4add681a149429c91ea",
  measurementId: "G-SVPMMPL4GL",
};
// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp;
const db = getFirestore(app);
module.exports = { db };
