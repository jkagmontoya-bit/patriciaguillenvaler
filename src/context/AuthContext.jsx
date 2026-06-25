import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name,
      email,
      createdAt: new Date()
    });
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", userCredential.user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        createdAt: new Date()
      });
    }
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loginWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
