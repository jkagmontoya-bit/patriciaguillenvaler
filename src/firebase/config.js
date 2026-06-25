import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLI8eDNCL1tMQN8bz-3XQ3xBZ2fyTmQrE",
  authDomain: "studio-pgv.firebaseapp.com",
  projectId: "studio-pgv",
  storageBucket: "studio-pgv.firebasestorage.app",
  messagingSenderId: "631308434247",
  appId: "1:631308434247:web:e31ded5b3e6f831406ea62",
  measurementId: "G-NED6CWJ5J4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
