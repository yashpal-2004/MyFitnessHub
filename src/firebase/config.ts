import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUMJQXi7ucZtqTK9jSb0jXfU-ATzK0fHY",
  authDomain: "myfitnesshub-1a5ec.firebaseapp.com",
  projectId: "myfitnesshub-1a5ec",
  storageBucket: "myfitnesshub-1a5ec.firebasestorage.app",
  messagingSenderId: "1072111347302",
  appId: "1:1072111347302:web:49a66a69161fb5d0202fa7",
  measurementId: "G-FJMEVQPT9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
