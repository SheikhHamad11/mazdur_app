import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const logout = async () => {
        try {
            await signOut(getAuth());
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                try {
                    const firestore = getFirestore();
                    const userRef = doc(firestore, 'users', user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists) {
                        setUserData(userSnap.data());
                    } else {
                        console.warn('User document not found');
                        setUserData(null);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, setUserData, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
