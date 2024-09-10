import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuFzb4xN9rXXhW0hIJ6k94UZYlTFGq9rI",
  authDomain: "todolist-c6c27.firebaseapp.com",
  projectId: "todolist-c6c27",
  storageBucket: "todolist-c6c27.appspot.com",
  messagingSenderId: "511587190648",
  appId: "1:511587190648:web:caab8fd3b6336320666a8d",
  measurementId: "G-MSBP46YZC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth()
export const provider =new GoogleAuthProvider

export default app;