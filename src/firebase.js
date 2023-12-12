import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBqknOF-jkbwuYU1UawC67tnOv2tSMe6aM",
    authDomain: "online-chess-with-friends.firebaseapp.com",
    projectId: "online-chess-with-friends",
    storageBucket: "online-chess-with-friends.appspot.com",
    messagingSenderId: "573680601980",
    appId: "1:573680601980:web:c1462667ae394af03632f9",
    measurementId: "G-58X6XKSNV3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
  