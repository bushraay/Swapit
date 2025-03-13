import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth'; // Removed getReactNativePersistence
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Anas - Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDLenC6uAw6GymQ5tLnuHujViSmatEvQpw",
  authDomain: "messagingapp-f07a7.firebaseapp.com",
  projectId: "messagingapp-f07a7",
  storageBucket: "messagingapp-f07a7.firebasestorage.app",
  messagingSenderId: "971354942884",
  appId: "1:971354942884:web:a233dc021048aa3d8a2531",
  measurementId: "G-GF03F1FKFF"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDFLdw02hBGlfrRAPp23GyUyyeJxCkws4g",
//   authDomain: "beto-chat-99da3.firebaseapp.com",
//   projectId: "beto-chat-99da3",
//   storageBucket: "beto-chat-99da3.firebasestorage.app",
//   messagingSenderId: "540082534382",
//   appId: "1:540082534382:web:2a576b34ba8f1b58f340ff",
//   measurementId: "G-YRSMM7JRZ7"
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

// Initialize Firebase Auth without persistence
export const auth = initializeAuth(app);
        

export const database = getFirestore(app); // Ensure you pass `app` to `getFirestore`
