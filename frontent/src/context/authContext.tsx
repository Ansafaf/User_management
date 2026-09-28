import { createContext, useState, type ReactNode } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}
export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User,token: string) => void;
    logout: ()=> void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({children}: {children: ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = (user: User, token: string)=>{
        setUser(user);
        setToken(token);
    }
    const logout = ()=>{
        setUser(null);
        setToken(null);
    }
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{user, token, isAuthenticated, login , logout}}>
            {children}
        </AuthContext.Provider>
    )
}
