import { createContext, useEffect, useState, type ReactNode } from "react";
import { getUserProfile } from "../services/userApi";
import type { AuthUser } from "../types/user";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";
const SESSION_CHECK_INTERVAL_MS = 10_000;

type AuthSession = {
    user: AuthUser;
    token: string;
};

const isAuthUser = (value: unknown): value is AuthUser => {
    if (typeof value !== "object" || value === null) return false;
    const candidate = value as Record<string, unknown>;
    return typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.email === "string" &&
        (candidate.role === "user" || candidate.role === "admin") &&
        (candidate.phone === undefined || typeof candidate.phone === "string");
};

const clearStoredSession = () => {
    try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
        // Storage may be unavailable; the in-memory session can still be cleared.
    }
};

const readStoredSession = (): AuthSession | null => {
    try {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        const serializedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (!token || !serializedUser) {
            clearStoredSession();
            return null;
        }

        const user: unknown = JSON.parse(serializedUser);
        if (!isAuthUser(user)) {
            clearStoredSession();
            return null;
        }

        return { user, token };
    } catch {
        clearStoredSession();
        return null;
    }
};

export type AuthContextType = {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: AuthUser, token: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<AuthSession | null>(readStoredSession);
    const sessionToken = session?.token;

    useEffect(() => {
        if (!sessionToken) return;

        let active = true;
        let checking = false;
        const checkSession = async () => {
            if (!active || checking || document.visibilityState !== "visible") return;
            checking = true;
            try {
                const profile = await getUserProfile(sessionToken);
                if (!active || !isAuthUser(profile?.user)) return;

                const refreshedUser: AuthUser = {
                    id: profile.user.id,
                    name: profile.user.name,
                    email: profile.user.email,
                    role: profile.user.role,
                    ...(typeof profile.user.phone === "string" ? { phone: profile.user.phone } : {}),
                    ...(typeof profile.user.profileImage === "string" ? { profileImage: profile.user.profileImage } : {}),
                };

                setSession((current) => {
                    if (!current || current.token !== sessionToken) return current;
                    const unchanged = current.user.id === refreshedUser.id &&
                        current.user.name === refreshedUser.name &&
                        current.user.email === refreshedUser.email &&
                        current.user.role === refreshedUser.role &&
                        current.user.phone === refreshedUser.phone &&
                        current.user.profileImage === refreshedUser.profileImage;
                    if (unchanged) return current;

                    try {
                        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(refreshedUser));
                    } catch {
                        // Keep the refreshed session available in memory.
                    }
                    return { ...current, user: refreshedUser };
                });
            } catch (error) {
                if (active) console.error("Could not verify the current user session.", error);
            } finally {
                checking = false;
            }
        };

        const checkWhenVisible = () => {
            if (document.visibilityState === "visible") void checkSession();
        };

        void checkSession();
        const intervalId = window.setInterval(() => void checkSession(), SESSION_CHECK_INTERVAL_MS);
        document.addEventListener("visibilitychange", checkWhenVisible);
        window.addEventListener("focus", checkWhenVisible);

        return () => {
            active = false;
            window.clearInterval(intervalId);
            document.removeEventListener("visibilitychange", checkWhenVisible);
            window.removeEventListener("focus", checkWhenVisible);
        };
    }, [sessionToken]);

    const login = (user: AuthUser, token: string) => {
        try {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch {
            // Keep the signed-in session available for the current page.
        }
        setSession({ user, token });
    };

    const logout = () => {
        clearStoredSession();
        setSession(null);
    };

    const user = session?.user ?? null;
    const token = session?.token ?? null;
    const isAuthenticated = Boolean(user && token);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
