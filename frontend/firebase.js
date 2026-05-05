// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgoX5bD9EOMxRwTe1lN1yRIg9lBiNR7So",
  authDomain: "swes-baaa7.firebaseapp.com",
  projectId: "swes-baaa7",
  storageBucket: "swes-baaa7.firebasestorage.app",
  messagingSenderId: "389325460051",
  appId: "1:389325460051:web:fa649ee1ff2dbf12466ca6",
  measurementId: "G-7L4PY663HL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);