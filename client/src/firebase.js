// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-835fd.firebaseapp.com",
  projectId: "blog-835fd",
  storageBucket: "blog-835fd.appspot.com",
  messagingSenderId: "224145586998",
  appId: "1:224145586998:web:1fd20559700f4f91dbd197",
  measurementId: "G-XR9Y7ESVSY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

