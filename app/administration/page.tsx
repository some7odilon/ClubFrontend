
"use client";



import { useState, useEffect } from "react";
import api from "@/app/API";
import toast from "react-hot-toast";
import {
  Users,
  Shield,
  Wallet,
  Activity,
  BarChart3,
  Settings,
  UserCog,
  CreditCard,
  ShoppingCart,
  Calendar,
  Bell,
  Download,
  Upload,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Crown,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Link from "next/link";

// Types
type User = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: "membre" | "tresorier" | "president";
  actif: boolean;
  date_inscription: string;
  dernier_acces?: string;
};

type DashboardStats = {
  totalUsers: number;
  totalMembres: number;
  totalTresoriers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalCotisations: number;
  totalDepenses: number;
  soldeCaisse: number;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "stats" | "settings">(
    "users",
  );
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("");

  useEffect(() => {
    loadData();
    loadDatastat();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const usersRes = await api.get("users/")
      setUsers(usersRes.data);
      console.log(usersRes.data)
    } catch (error) {
      console.error("Erreur chargement des utilisateurs:", error);
      toast.error("Erreur lors du chargement des données utilisateur");
    } finally {
      setLoading(false);
    }
  };

   const loadDatastat = async () => {
    setLoading(true);

    try {
      const statsRes = await api.get("/admin/stats")
      setStats(statsRes.data);
      console.log(statsRes.data) 
    } catch (error) {
      console.error("Erreur chargement des stats:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };


  const updateUserRole = async (userId: string, role: string) => {
    try {
      await api.patch(`users/${userId}/`, { role });
      loadData();
      loadDatastat();
      toast.success("Rôle mis à jour avec succès");
      setEditingUser(null);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const toggleUserStatus = async (userId: string, actif: boolean) => {
    try {
      await api.patch(`users/${userId}/status`, { actif: !actif });
      loadData();
      loadDatastat();
      toast.success(
        `Utilisateur ${!actif ? "activé" : "désactivé"} avec succès`,
      );
    } catch (error) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte");
      return;
    }
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/users/${userId}/`);
        loadData();
        loadDatastat();
        toast.success("Utilisateur supprimé");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const exportData = async (format: "csv" | "excel") => {
    try {
      const response = await api.get(`admin/export?format=${format}/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `export_${new Date().toISOString()}.${format}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export terminé");
    } catch (error) {
      toast.error("Erreur lors de l'export");
      console.error
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.prenom} ${u.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="president">
      <div className="min-h-screen bg-base-200">
        {/* Header */}
        <div className="bg-base-100 shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-8 h-8 text-warning" />
                  Administration
                </h1>
                <p className="text-sm opacity-70">Gestion complète du club</p>
              </div>
              <div className="flex gap-2">

                 <Link href="/dashboard" className="btn btn-sm btn-primary rounded ">
                  <TrendingUp className="w-4 h-4 mr-2" />
                    Retour au dashboard
                </Link>

                <button
                  onClick={() => exportData("excel")}
                  className="btn btn-sm btn-success"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => exportData("csv")}
                  className="btn btn-sm btn-info"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="stat bg-base-100 rounded-lg shadow">
                <div className="stat-figure text-primary">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Utilisateurs</div>
                <div className="stat-value text-primary">
                  {stats.totalUsers}
                </div>
                <div className="stat-desc">
                  +{stats.newUsersThisMonth} ce mois
                </div>
              </div>

              <div className="stat bg-base-100 rounded-lg shadow">
                <div className="stat-figure text-success">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-title">Actifs</div>
                <div className="stat-value text-success">
                  {stats.activeUsers}
                </div>
                <div className="stat-desc">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% du
                  total
                </div>
              </div>

              <div className="stat bg-base-100 rounded-lg shadow">
                <div className="stat-figure text-warning">
                  <Wallet className="w-8 h-8" />
                </div>
                <div className="stat-title">Trésorerie</div>
                <div className="stat-value text-warning">
                  {stats.soldeCaisse.toFixed(2)} FCFA
                </div>
                <div className="stat-desc">
                  Cotisations: {stats.totalCotisations.toFixed(2)} FCFA
                </div>
              </div>

              <div className="stat bg-base-100 rounded-lg shadow">
                <div className="stat-figure text-info">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="stat-title">Taux d activité</div>
                <div className="stat-value text-info">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </div>
                <div className="stat-desc">Objectif: 80%</div>
              </div>
            </div>
          )}

          {/* Onglets */}
          <div className="tabs tabs-boxed justify-center mb-6">
            <a
              className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Utilisateurs
            </a>
            <a
              className={`tab ${activeTab === "stats" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistiques
            </a>
            <a
              className={`tab ${activeTab === "settings" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </a>
          </div>

          {/* Gestion des utilisateurs */}
          {activeTab === "users" && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">
                    <UserCog className="w-5 h-5" />
                    Gestion des utilisateurs
                  </h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="input input-bordered w-64 pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Statut</th>
                        <th>Date inscription</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className={!u.actif ? "opacity-50" : ""}>
                          <td>
                            <div className="flex items-center gap-3">

                              <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content text-center rounded-full w-10">
                                  <span>
                                    {u.prenom.charAt(0)}
                                    {u.nom.charAt(0)}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <div className="font-semibold">
                                  {u.prenom} {u.nom}
                                </div>
                                {u.role === "president" && (
                                  <div className="badge badge-warning badge-sm">
                                    Président
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            {editingUser === u.id ? (
                              <select
                                className="select select-bordered select-sm"
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                              >
                                <option value="membre">Membre</option>
                                <option value="tresorier">Trésorier</option>
                                <option value="president">Président</option>
                              </select>
                            ) : (
                              <span
                                className={`badge ${
                                  u.role === "president"
                                    ? "badge-warning"
                                    : u.role === "tresorier"
                                      ? "badge-success"
                                      : "badge-info"
                                }`}
                              >
                                {u.role}
                              </span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${u.actif ? "badge-success" : "badge-error"}`}
                            >
                              {u.actif ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          <td className="text-sm">
                            {new Date(u.date_inscription).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              {editingUser === u.id ? (
                                <>
                                  <button
                                    className="btn btn-xs btn-success"
                                    onClick={() =>
                                      updateUserRole(u.id, editRole)
                                    }
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </button>
                                  <button
                                    className="btn btn-xs btn-ghost"
                                    onClick={() => setEditingUser(null)}
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-xs btn-primary"
                                    onClick={() => {
                                      setEditingUser(u.id);
                                      setEditRole(u.role);
                                    }}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    className={`btn btn-xs ${u.actif ? "btn-warning" : "btn-success"}`}
                                    onClick={() =>
                                      toggleUserStatus(u.id, u.actif)
                                    }
                                  >
                                    {u.actif ? (
                                      <XCircle className="w-3 h-3" />
                                    ) : (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                  </button>
                                  {u.id !== user?.id && (
                                    <button
                                      className="btn btn-xs btn-error"
                                      onClick={() => deleteUser(u.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Statistiques avancées */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Graphiques et analyses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Évolution des inscriptions</h3>
                    <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
                      {/* Intégrez un graphique ici (recharts, chart.js, etc.) */}
                      <p className="text-center opacity-50">
                        Graphique d'évolution des inscriptions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Répartition des rôles</h3>
                    <div className="space-y-3">
                      {stats && (
                        <>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Membres</span>
                              <span>{stats.totalMembres}</span>
                            </div>
                            <progress
                              className="progress progress-info"
                              value={stats.totalMembres}
                              max={stats.totalUsers}
                            ></progress>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Trésoriers</span>
                              <span>{stats.totalTresoriers}</span>
                            </div>
                            <progress
                              className="progress progress-success"
                              value={stats.totalTresoriers}
                              max={stats.totalUsers}
                            ></progress>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Présidents</span>
                              <span>1</span>
                            </div>
                            <progress
                              className="progress progress-warning"
                              value={1}
                              max={stats.totalUsers}
                            ></progress>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activité récente */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Activité récente</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-8">
                              <span className="text-xs">
                                {u.prenom.charAt(0)}
                                {u.nom.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm">
                              {u.prenom} {u.nom}
                            </div>
                            <div className="text-xs opacity-70">{u.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs">Inscrit le</div>
                          <div className="text-xs font-semibold">
                            {new Date(u.date_inscription).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paramètres système */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration générale */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Configuration générale</h3>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Maintenance mode</span>
                        <input type="checkbox" className="toggle" />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          Inscriptions automatiques
                        </span>
                        <input
                          type="checkbox"
                          className="toggle"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Montant cotisation par défaut
                        </span>
                      </label>
                      <input
                        type="number"
                        placeholder="Montant"
                        className="input input-bordered"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Notifications</h3>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          Email pour nouvelles inscriptions
                        </span>
                        <input
                          type="checkbox"
                          className="toggle"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          Rappel cotisations impayées
                        </span>
                        <input
                          type="checkbox"
                          className="toggle"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Alertes sécurité</span>
                        <input
                          type="checkbox"
                          className="toggle"
                          defaultChecked
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sauvegarde */}
              <div className="card bg-base-100 shadow-xl lg:col-span-2">
                <div className="card-body">
                  <h3 className="card-title">Sauvegarde et restauration</h3>
                  <div className="flex gap-4">
                    <button className="btn btn-primary">
                      <Download className="w-4 h-4" />
                      Sauvegarder maintenant
                    </button>
                    <button className="btn btn-secondary">
                      <Upload className="w-4 h-4" />
                      Restaurer une sauvegarde
                    </button>
                  </div>
                  <div className="alert alert-info mt-4">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Dernière sauvegarde: {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Composant Search manquant
function Search(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" className="align" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
