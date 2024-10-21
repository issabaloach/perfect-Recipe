
import { createContext, useState } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Spin } from "antd";


export const AuthContext = createContext();

function AuthContextProvider({ children }) {
    const [user, setUser] = useState({
        isLogin: false,
        userInfo: null
    })
}

const [loading, setLoading] = useState(true)

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
    <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>
);

export default AuthContextProvider;
