// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // <--- AGREGAR ESTO
import { getFirestore } from "firebase/firestore"; // <--- AGREGAR ESTO
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9hh7H9GTFqgYoRRbXZebARrnhGT0TtUE",
  authDomain: "swes1-42104.firebaseapp.com",
  projectId: "swes1-42104",
  storageBucket: "swes1-42104.firebasestorage.app",
  messagingSenderId: "1225758691",
  appId: "1:1225758691:web:3086b003a1c1bdd5f172d6",
  measurementId: "G-35LFFFJ8T9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// --- EXPORTAR LOS SERVICIOS PARA QUE LOGIN Y REGISTER 
export const auth = getAuth(app); 
export const db = getFirestore(app); 