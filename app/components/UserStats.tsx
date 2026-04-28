
"use client";

import { Activity, Calendar, Clock, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function UserStats() {
    const { user, hasPermission } = useAuth();

    if (!user) return null;


    const formatDate = (dateString?: string) => {
        if (!dateString) return "Non disponible";
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };



    const stats = [
        {
            label: "Rôle",
            value: user.role,
            icon: Shield,
            color: user.role === 'president' ? 'text-warning' : 
                   user.role === 'tresorier' ? 'text-success' : 'text-info'
        },
        {
            label: "Membre depuis",
            value: formatDate(user.date_inscription),
            icon: Calendar,
            color: "text-primary"
        },
        {
            label: "Statut",
            value: user.actif ? "Actif" : "Inactif",
            icon: Activity,
            color: user.actif ? "text-success" : "text-error"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="stat bg-base-100 rounded-lg shadow p-4">
                        <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${stat.color}`} />
                            <div className="stat-title text-xs">{stat.label}</div>
                        </div>
                        <div className="stat-value text-lg capitalize mt-2">{stat.value}</div>
                    </div>
                );
            })}
            
            {hasPermission('tresorier') && (
                <div className="stat bg-base-100 rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-warning" />
                        <div className="stat-title text-xs">Session</div>
                    </div>
                    <div className="stat-value text-lg mt-2">
                        {new Date().toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}