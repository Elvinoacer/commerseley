import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3p8FunVaYm3zWRdGpRujbSq7La_rcy-I",
  authDomain: "push-notifications-7a046.firebaseapp.com",
  projectId: "push-notifications-7a046",
  storageBucket: "push-notifications-7a046.firebasestorage.app",
  messagingSenderId: "385413079509",
  appId: "1:385413079509:web:638a2fa6cc5d1a15911d5c",
  measurementId: "G-7S5W0SVRWN",
};

export const app = initializeApp(firebaseConfig);
