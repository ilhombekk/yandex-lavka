import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem("isAdmin") === "true";
    });
    
    function login(username, password) {
        if (username === "admin" && password === "12345") {
            setIsAdmin(true);
            localStorage.setItem("isAdmin", "true");
            return { success: true };
        }
        
        return { success: false, message: "Login yoki parol xato" };
    }
    
    function logout() {
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
    }
    
    const value = useMemo(
        () => ({
            isAdmin,
            login,
            logout,
        }),
        [isAdmin]
    );
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}