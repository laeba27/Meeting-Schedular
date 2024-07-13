// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "meeting-scheduler-e2464.firebaseapp.com",
  projectId: "meeting-scheduler-e2464",
  storageBucket: "meeting-scheduler-e2464.appspot.com",
  messagingSenderId: "273102992015",
  appId: "1:273102992015:web:993defe138f27c11d836fa",
  measurementId: "G-J0TDKQ3D5T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
