"use client";

import React, { useContext, useState, useEffect, createContext } from "react";
import { AuthContextType, UserRole, User } from "../types/auth";
import api from "../API";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const verifAuth = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                const response = await api.get("auth/me");
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem("token");
                delete api.defaults.headers.common['Authorization']
                setUser(null);
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        verifAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            const response = await api.post("auth/login", { email, password });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(user);

            toast.success(`Bienvenue ${user.prenom} ${user.nom}`);
        } catch (error) {
            toast.error("Email ou mot de passe incorrect");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {

        try {

            if(user) {
                await api.post("auth/logout").catch(() => {});
            }
            
        } catch (error) {

            console.error("Erreur lors de la déconnexion", error)
            
        } finally {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization']
            setUser(null)
            toast.success("Déconnexion réussie")
        }

    };

    const hasPermission = (requiredRole: UserRole): boolean => {
        if (!user) return false;

        const roleHierarchie: Record<UserRole, number> = {
            membre: 1,
            tresorier: 2,
            president: 3
        };

        return roleHierarchie[user.role] >= roleHierarchie[requiredRole];
    };

    const hasAnyPermission = (roles: UserRole[]): boolean => {
        return roles.some(role => hasPermission(role));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission, hasAnyPermission }}>

            {children}

        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé avec AuthProvider");
    return context;
};