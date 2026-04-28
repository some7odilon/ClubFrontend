"use client"


import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/auth";
import { useEffect } from "react";

interface ProtectedProps {
    children:React.ReactNode;
    requiredRole?:UserRole;
    allowedRoles?: UserRole[]
    
}


export function ProtectedRoute({ children, 
  requiredRole, 
  allowedRoles
 }:ProtectedProps) {

    const { user, isLoading, hasPermission, hasAnyPermission } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!isLoading) {
            if(!user) {
                router.push("/login")
            } else if (requiredRole && !hasPermission(requiredRole)) {
                router.push("/unauthorized");

            } else if(allowedRoles && !hasAnyPermission(allowedRoles)) {
                router.push("/unauthorized");
            }
        }
    }, [user ,isLoading, router, requiredRole, allowedRoles]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-sm opacity-70">Vérification de l'authentification...</p>
                </div>
            </div>
        );
    }

  if(!user) return null;
  if(requiredRole && !hasPermission(requiredRole)) return null
  if(allowedRoles && !hasAnyPermission(allowedRoles)) return null


  return <> {children} </>


 }