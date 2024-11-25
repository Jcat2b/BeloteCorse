import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB0StH_qLbu8znWGzGW9kz3EpvzlQQVPcc",
  authDomain: "belotecorse-44fae.firebaseapp.com",
  projectId: "belotecorse-44fae",
  storageBucket: "belotecorse-44fae.firebasestorage.app",
  messagingSenderId: "222386478070",
  appId: "1:222386478070:web:3141ccb4e51e55a93e85d7",
  measurementId: "G-Q3J0077PVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);