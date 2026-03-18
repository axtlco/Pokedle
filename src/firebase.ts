// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtbf8-a6SCrO3X4OKViRQynyBSSpxXHkw",
  authDomain: "pokedle-1b943.firebaseapp.com",
  projectId: "pokedle-1b943",
  storageBucket: "pokedle-1b943.firebasestorage.app",
  messagingSenderId: "217562847865",
  appId: "1:217562847865:web:7b80b2136b300708cf92a8",
  measurementId: "G-58DHRWZDFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app); 
export const db = getFirestore(app);