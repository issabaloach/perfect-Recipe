import { Spin, message } from "antd";
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "../utils/firebase";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
    const [user, setUser] = useState({
        isLogin: false,
        userInfo: null
    });

    const [loading, setLoading] = useState(true);

    const handleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                message.info('Sign-in cancelled. You can try again when you are ready.');
            } else {
                message.error('An error occurred during sign-in. Please try again.');
                console.error('Sign-in error:', error);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser({
                    isLogin: true,
                    userInfo: {
                        name: authUser.displayName,
                        photoURL: authUser.photoURL,
                        email: authUser.email,
                        uid: authUser.uid,
                    },
                });
            } else {
                setUser({ isLogin: false, userInfo: null });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, handleSignIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;