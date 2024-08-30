const { initializeApp, getApp, getApps } = require("firebase/app");
//import { getAuth } from "firebase/auth";
//import { getStorage } from "firebase/storage";
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

/*
const firebase = require("firebase");
//require("firebase/auth"); // Si vous utilisez Firebase Auth
//require("firebase/firestore"); // Si vous utilisez Firestore

// Ajoutez d'autres services Firebase si nécessaire

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBPIc-g0fXX_xIqyWe-0t39ilStHrHPAtU",
  authDomain: "natural-voice-28245.firebaseapp.com",
  projectId: "natural-voice-28245",
  storageBucket: "natural-voice-28245.appspot.com",
  messagingSenderId: "345122734687",
  appId: "1:345122734687:web:99e4add681a149429c91ea",
  measurementId: "G-SVPMMPL4GL",
};

// Initialiser Firebase
const db = firebase.initializeApp(firebaseConfig);

// Exporter Firebase si vous en avez besoin ailleurs dans votre application
module.exports = db;
*/
