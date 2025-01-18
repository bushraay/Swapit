import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDLenC6uAw6GymQ5tLnuHujViSmatEvQpw",
    authDomain: "messagingapp-f07a7.firebaseapp.com",
    projectId: "messagingapp-f07a7",
    storageBucket: "messagingapp-f07a7.firebasestorage.app",
    messagingSenderId: "971354942884",
    appId: "1:971354942884:web:a233dc021048aa3d8a2531",
    measurementId: "G-GF03F1FKFF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to test Firestore
async function testFirestore() {
  try {
    const docRef = await addDoc(collection(db, "testCollection"), {
      name: "John Doe",
      email: "johndoe@example.com",
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

testFirestore();
