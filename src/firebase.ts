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

/**
 * Firebase configuration and initialization.
 * 
 * @module firebase
 * 
 * @description
 * This module sets up and initializes the Firebase app using environment variables 
 * for configuration. It also exports the initialized Firebase services such as Firestore,
 * Authentication, and Analytics.
 * 
 * @requires firebase/app
 * @requires firebase/firestore
 * @requires firebase/analytics
 * @requires firebase/auth
 * 
 * @constant {Object} firebaseConfig - The configuration object for Firebase services. 
 * Contains environment-specific keys and IDs required for connecting to the Firebase project.
 * 
 * @property {string} firebaseConfig.apiKey - The API key for Firebase authentication.
 * @property {string} firebaseConfig.authDomain - The authentication domain for Firebase.
 * @property {string} firebaseConfig.projectId - The project ID of the Firebase project.
 * @property {string} firebaseConfig.storageBucket - The storage bucket URL for Firebase storage.
 * @property {string} firebaseConfig.messagingSenderId - The sender ID for Firebase messaging.
 * @property {string} firebaseConfig.appId - The application ID for the Firebase app.
 * @property {string} firebaseConfig.measurementId - The measurement ID for Firebase analytics.
 * 
 * @constant {FirebaseApp} app - The initialized Firebase app instance.
 * 
 * @constant {Analytics} analytics - The Firebase Analytics instance.
 * 
 * @constant {Firestore} db - The Firestore instance for database operations.
 * 
 * @constant {Auth} auth - The Firebase Authentication instance.
 * 
 * @exports db
 * @exports auth
 * @exports app
 */
const app = initializeApp(firebaseConfig);

getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;