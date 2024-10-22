import { initializeApp } from "firebase/app";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  getAuth,
} from "firebase/auth";

import { getFirestore} from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCjwt3XclRZLCAk-UrG79d3GmJKequMuEY",
  authDomain: "perfectrecipe-3357f.firebaseapp.com",
  projectId: "perfectrecipe-3357f",
  storageBucket: "perfectrecipe-3357f.appspot.com",
  messagingSenderId: "814124723584",
  appId: "1:814124723584:web:769c8efcca0c8de12c6565",
  measurementId: "G-77SR1KMZW8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export {auth, db}