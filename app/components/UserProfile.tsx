"use client"

import React, { Activity, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Crown, Wallet, Users, Shield, Calendar, LogOut, Mail, Settings } from 'lucide-react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
const UserProfile = () => {

    const { user, logout, hasPermission } = useAuth()
    const [showdetail, setshowDetails] = useState(false)
    const router  = useRouter()

    if(!user) return null;

    const getRoleIcon = () => {
        switch (user.role) {
            case 'president':
                 return <Crown className="w-5 h-5 text-warning" />;
            case 'tresorier':
                return <Wallet className="w-5 h-5 text-success" />;
            default:
                return <Users className="w-5 h-5 text-info" />;
        }
    }

    const getRoleBadge = () => {
       const badge = {


        president: { color:"badge-warning", label: "Président",  icon:Crown},

        tresorier: { color:"badge-success", label: "Trésorier", icon:Wallet},

        membre: { color:"badge-info", label: "Membre", icon:Users } 
       }

       const role = user.role 
       const BadgeIcon = badge[role].icon

       return (
            <div className={`badge ${badge[role].color} gap-2 p-3`}>
                <BadgeIcon className="w-3 h-3" />
                {badge[role].label}
            </div>
        );


    }

    const getInitials = () => {

        const firsLetter = (user.prenom || user.prenom || "" ).charAt(0).toUpperCase();
        const lastLetter = (user.nom || "").charAt(0).toUpperCase();

        return `${firsLetter}${lastLetter}`
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Non disponible";
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };


    const redirectoAdmonPAge = () => {

        router.push("/admin")
    }



    const redirectoAdministrationPAge = () => {

        router.push("/administration")
    }




  return (
        <div className="card bg-base-100 shadow-xl">
            {/* En-tête avec bannière */}
            <div className="relative">
                <div className="h-24 bg-gradient-to-r from-primary to-secondary rounded-t-xl"></div>
                
                {/* Avatar */}
                <div className="absolute -bottom-12 left-4">
                    <div className="avatar">
                        <div className="w-24 h-24 rounded-full border-4 border-base-100 bg-base-200 flex items-center justify-center text-center">
                            {user.avatar ? (
                                <Image 
                                    src={user.avatar} 
                                    alt={`${user.prenom} ${user.nom}`}
                                    width={96}
                                    height={96}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="text-3xl font-bold text-primary items-center justify-center text-center">
                                    {getInitials()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bouton logout */}
                <button
                    onClick={logout}
                    className="absolute top-4 right-4 btn btn-sm btn-error btn-soft"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>

            {/* Informations utilisateur */}
            <div className="card-body pt-16">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="card-title text-2xl">
                            {user.prenom || user.prenom} {user.nom}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            {getRoleBadge()}
                            <span className="text-sm opacity-70">
                                Membre depuis {formatDate( user.date_inscription)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Bouton détails */}
                    <button
                        onClick={() => setshowDetails(!showdetail)}
                        className="btn btn-sm btn-ghost"
                    >
                        <Settings className="w-4 h-4" />
                        {showdetail ? "Masquer" : "Détails"}
                    </button>
                </div>

                {/* Détails supplémentaires */}
                {showdetail && (
                    <div className="mt-4 p-4 bg-base-200 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 opacity-70" />
                            <span className="font-semibold">Email:</span>
                            <span>{user.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4 opacity-70" />
                            <span className="font-semibold">Rôle:</span>
                            <span className="capitalize">{user.role}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 opacity-70" />
                            <span className="font-semibold">Date d'inscription:</span>
                            <span>{formatDate(user.date_inscription)}</span>
                        </div>
                        
                        {user.dernier_acces && (
                            <div className="flex items-center gap-2 text-sm">
                                <Activity className="w-4 h-4 opacity-70" />
                                <span className="font-semibold">Dernier accès:</span>
                                <span>{formatDate(user.dernier_acces)}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Statistiques rapides (selon le rôle) */}
                <div className="divider text-xs">ACCÈS RAPIDE</div>
                
                <div className="flex gap-2 mt-2">
                    {hasPermission('tresorier') && (
                        <>
                            <button className="btn btn-sm btn-success flex-1">
                                <Wallet className="w-4 h-4" />
                                Finances
                            </button>
                            <button className="btn btn-sm btn-info flex-1" onClick={redirectoAdmonPAge} >
                                <Users className="w-4 h-4" />
                                Membres
                            </button>
                        </>
                    )}
                    
                    {user.role === 'president' && (
                        <button className="btn btn-sm btn-warning flex-1" onClick={redirectoAdministrationPAge}  >
                            <Shield className="w-4 h-4" />
                            Administration
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile
