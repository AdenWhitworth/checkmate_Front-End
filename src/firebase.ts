import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY as string,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN as string,
    projectId: process.env.REACT_APP_PROJECT_ID as string,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET as string,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID as string,
    appId: process.env.REACT_APP_APP_ID as string,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID as string
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;