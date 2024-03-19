import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, deleteUser, sendPasswordResetEmail} from "firebase/auth";
import { auth }  from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function logOut(){
    return signOut(auth);
 }

export function AuthProvider({ children }) {
    const provider = new GoogleAuthProvider();

    const [currentUser, setCurrentUser] = useState();
    const [waiting, setWaiting] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
     }
     
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signInWithGoogle() {
        return signInWithPopup(auth, provider)
    }

    function deleteAccount() {
        return deleteUser(auth.currentUser)
    }

    function getCurrentUserIdString() {
        return currentUser.uid;
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setWaiting(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        getCurrentUserIdString,
        signInWithGoogle,
        deleteAccount,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
        {!waiting && children}
        </AuthContext.Provider>
    );
}