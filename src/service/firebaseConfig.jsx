// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmakUMn6t5o2NIqGDgN2eRnnrNeUzSfGU",
  authDomain: "ai-trip-planner-2dfe5.firebaseapp.com",
  projectId: "ai-trip-planner-2dfe5",
  storageBucket: "ai-trip-planner-2dfe5.firebasestorage.app",
  messagingSenderId: "797763200055",
  appId: "1:797763200055:web:db13590a839afcd45dcbb2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);