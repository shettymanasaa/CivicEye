// ============================================================
// IMPORTANT: Replace ALL values below with YOUR Firebase config
// Get it from: Firebase Console → Project Settings → Your Apps
// ============================================================

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
   apiKey: "AIzaSyAYt3bxUApPRSZKBERtayob2zWsJXoLuOo",
  authDomain: "fixmycity-cea56.firebaseapp.com",
  projectId: "fixmycity-cea56",
  storageBucket: "fixmycity-cea56.firebasestorage.app",
  messagingSenderId: "367549274761",
  appId: "1:367549274761:web:620864a24708491351c458",
  measurementId: "G-6RR703GD17"
};


const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    try {
      await signInAnonymously(auth);
      console.log("Anonymous login successful");
    } catch (err) {
      console.error(err);
    }
  }
});
