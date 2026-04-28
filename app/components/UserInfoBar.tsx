// components/UserInfoBar.tsx
"use client";

import { User, LogOut, ChevronDown, Shield, Crown, Wallet, Users, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UserInfoBar() {
    const { user, logout, hasPermission } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const getRoleColor = () => {
        switch (user.role) {
            case 'president': return 'text-warning';
            case 'tresorier': return 'text-success';
            default: return 'text-info';
        }
    };

    const getRoleIcon = () => {
        switch (user.role) {
            case 'president': return <Crown className="w-4 h-4" />;
            case 'tresorier': return <Wallet className="w-4 h-4" />;
            default: return <Users className="w-4 h-4" />;
        }
    };

    const getInitials = () => {
        const firstLetter = (user.prenom || user.prenom || "").charAt(0).toUpperCase();
        const lastLetter = (user.nom || "").charAt(0).toUpperCase();
        return `${firstLetter}${lastLetter}`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:bg-base-200 rounded-lg p-2 transition-colors"
            >
                {/* Avatar */}
                <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10 text-center">
                        <span className="text-sm">{getInitials()}</span>
                    </div>
                </div>
                
                {/* Infos */}
                <div className="hidden md:block text-left">
                    <div className="font-semibold text-sm">
                        {user.prenom || user.prenom} {user.nom}
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${getRoleColor()}`}>
                        {getRoleIcon()}
                        <span className="capitalize">{user.role}</span>
                    </div>
                </div>
                
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                        <div className="font-semibold">{user.prenom || user.prenom} {user.nom}</div>
                        <div className="text-xs opacity-70 flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                        </div>
                        <div className="mt-2">
                            <span className={`badge badge-sm ${getRoleColor()} gap-1`}>
                                {getRoleIcon()}
                                {user.role}
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                            }}
                            className="btn btn-sm btn-error btn-soft w-full"
                        >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}