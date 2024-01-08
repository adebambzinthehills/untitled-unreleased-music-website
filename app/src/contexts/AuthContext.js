import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import auth from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function logOut(){
    return signOut(auth);
 }

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [waiting, setWaiting] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
     }
     
     function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
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
        login
    }

    return (
        <AuthContext.Provider value={value}>
        {!waiting && children}
        </AuthContext.Provider>
    );
}