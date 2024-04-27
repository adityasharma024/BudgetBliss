// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByTj4tKnOQ9x8qh9HEA0u9FclnldVQ5aU",
  authDomain: "budgetbliss-8c8e1.firebaseapp.com",
  projectId: "budgetbliss-8c8e1",
  storageBucket: "budgetbliss-8c8e1.appspot.com",
  messagingSenderId: "776592544305",
  appId: "1:776592544305:web:2a04f80847bc33d5fa7b10",
  measurementId: "G-2Y3VP716RK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };