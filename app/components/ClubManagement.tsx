"use client";

import { useEffect, useState } from "react";
import api from "../API";
import toast from "react-hot-toast";

type Member = {
  id: string;
  nom: string;
  prenoms: string;
  categorie: "ADULTE" | "ENFANT";
  grade: "BLANCHE" | "1ere JAUNE" | "1ere VERTE" | '2ieme VERTE' | '1ere BLEUE' | '2ieme BLEUE' | '3ieme BLEUE' | '1ere ROUGE' | '2ieme ROUGE' | '3ieme ROUGE' | '1ere DAN' | '2ieme DAN' | '3ieme DAN'
  date_inscription: string;
  statut: "actif" | "inactif";
};

type Cotisation = {
  id: string;
  member_id: string;
  member_name: string;
  mois: string;
  annee: number;
  montant: number;
  date_paiement: string;
  statut: "payé" | "impayé";
};

type Depense = {
  id: string;
  libelle: string;
  montant: number;
  date_depense: string;
  categorie: string;
};

import {
  Activity,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash,
  PlusCircle,
  UserPlus,
  CreditCard,
  ShoppingCart,
  Calendar,
  Search,
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ClubManagement() {
  // États
  const [members, setMembers] = useState<Member[]>([]);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [activeTab, setActiveTab] = useState<"members" | "cotisations" | "depenses">("members");
  
  // États pour les formulaires
  const [newMember, setNewMember] = useState({ nom: "", prenoms: "", categorie: "ENFANT" , grade:"BLANCHE"});
  const [newCotisation, setNewCotisation] = useState({ member_id: "", mois: "", annee: new Date().getFullYear(), montant: 0 });
  const [newDepense, setNewDepense] = useState({ libelle: "", montant: 0, categorie: "" });
  
  const [load, setLoad] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isLoading } = useAuth();

  // Vérifier si l'utilisateur a accès aux données financières
  const hasFinanceAccess = () => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    return role === "président" || role === "president" || role === "trésorier" || role === "tresorier";
  };

  const getGradeBadgeClass = (grade: string) => {
    const classes = {
      "BLANCHE": "badge-ghost",
      "1ere JAUNE": "badge-warning",
      "1ere VERTE": "badge-success",
      "2ieme VERTE": "badge-success",
      "1ere BLEUE": "badge-info",
      "2ieme BLEUE": "badge-info",
      "3ieme BLEUE": "badge-info",
      "1ere ROUGE": "badge-error",
      "2ieme ROUGE": "badge-error",
      "3ieme ROUGE": "badge-error",
      "1ere DAN": "badge-secondary",
      "2ieme DAN": "badge-secondary",
      "3ieme DAN": "badge-secondary"
    };
    
    return classes[grade as keyof typeof classes] || "badge-ghost";
  };

  const toNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  };

  const formatMoney = (value: any, currency: string = "FCFA"): string => {
    const num = toNumber(value);
    return `${num.toFixed(2)} ${currency}`;
  };

  const loadData = async () => {
    try {
      const [membersRes, cotisationsRes, depensesRes] = await Promise.all([
        api.get("members/"),
        api.get("cotisations/"),
        api.get("depenses/")
      ]);

      setMembers(membersRes.data);
      
      const cotisationsWithNumbers = cotisationsRes.data.map((c: any) => ({
        ...c,
        montant: toNumber(c.montant)
      }));
      setCotisations(cotisationsWithNumbers);
      
      const depensesWithNumbers = depensesRes.data.map((d: any) => ({
        ...d,
        montant: toNumber(d.montant)
      }));
      setDepenses(depensesWithNumbers);
      
      toast.success("Données chargées");
    } catch (error) {
      console.error("Erreur de chargement", error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  
  const totalMembres = members.length;
  const membresActifs = members.filter(m => m.statut === "actif").length;

  const totalCotisations = cotisations.reduce((acc, c) => acc + toNumber(c.montant), 0);
  const cotisationsRecues = cotisations
    .filter(c => c.statut === "payé")
    .reduce((acc, c) => acc + toNumber(c.montant), 0);
  const cotisationsImpayees = totalCotisations - cotisationsRecues;
  
  const totalDepenses = depenses.reduce((acc, d) => acc + toNumber(d.montant), 0);
  const soldeCaisse = cotisationsRecues - totalDepenses;

  // Gestion des membres
  const addMember = async () => {
    if (!newMember.nom || !newMember.prenoms) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoad(true);
    try {
      await api.post("members/", {
        ...newMember,
        date_inscription: new Date().toISOString(),
        statut: "actif"
      });
      await loadData();
      toast.success("Membre ajouté avec succès");
      setNewMember({ nom: "", prenoms: "", categorie: "ENFANT", grade: "BLANCHE" });
      (document.getElementById("member_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoad(false);
    }
  };

  const addCotisation = async () => {
    if (!newCotisation.member_id || !newCotisation.mois || !newCotisation.montant) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoad(true);
    try {
      await api.post("cotisations/", {
        member_id: newCotisation.member_id,
        mois: newCotisation.mois,
        annee: newCotisation.annee,
        montant: newCotisation.montant,
        statut: "payé"
      });
      await loadData();
      toast.success("Cotisation enregistrée");
      setNewCotisation({ member_id: "", mois: "", annee: new Date().getFullYear(), montant: 0 });
      (document.getElementById("cotisation_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoad(false);
    }
  };

  const addDepense = async () => {
    if (!newDepense.libelle || !newDepense.montant || !newDepense.categorie) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoad(true);
    try {
      await api.post("depenses/", {
        ...newDepense,
        date_depense: new Date().toISOString()
      });
      await loadData();
      toast.success("Dépense enregistrée");
      setNewDepense({ libelle: "", montant: 0, categorie: "" });
      (document.getElementById("depense_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoad(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      try {
        await api.delete(`members/${id}/`);
        await loadData();
        toast.success("Membre supprimé");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
        console.error(error);
      }
    }
  };

  const deleteCotisation = async (id: string) => {
    // Vérifier les droits avant suppression
    if (!hasFinanceAccess()) {
      toast.error("Vous n'avez pas les droits pour supprimer une cotisation");
      return;
    }
    try {
      await api.delete(`cotisations/${id}/`);
      await loadData();
      toast.success("Cotisation supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.log(error);
    }
  };

  const deleteDepense = async (id: string) => {
    // Vérifier les droits avant suppression
    if (!hasFinanceAccess()) {
      toast.error("Vous n'avez pas les droits pour supprimer une dépense");
      return;
    }
    try {
      await api.delete(`depenses/${id}/`);
      await loadData();
      toast.success("Dépense supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filteredMembers = members.filter(m => 
    `${m.prenoms} ${m.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte Membres - visible par tous */}
        <div className="rounded-2xl border-2 border-primary/10 bg-primary/5 p-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="badge badge-soft badge-primary">Membres</span>
          </div>
          <div className="stat-value text-primary">{totalMembres}</div>
          <div className="text-sm opacity-70">{membresActifs} actifs</div>
        </div>

        {/* Cartes financières - visibles uniquement pour trésorier et président */}
        {hasFinanceAccess() && (
          <>
            <div className="rounded-2xl border-2 border-success/10 bg-success/5 p-5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-success" />
                <span className="badge badge-soft badge-success">Cotisations reçues</span>
              </div>
              <div className="stat-value text-success">{formatMoney(cotisationsRecues)}</div>
            </div>

            <div className="rounded-2xl border-2 border-error/10 bg-error/5 p-5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-error" />
                <span className="badge badge-soft badge-error">Dépenses</span>
              </div>
              <div className="stat-value text-error">{formatMoney(totalDepenses)}</div>
            </div>

            <div className="rounded-2xl border-2 border-warning/10 bg-warning/5 p-5">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-warning" />
                <span className="badge badge-soft badge-warning">Solde caisse</span>
              </div>
              <div className={`stat-value ${soldeCaisse >= 0 ? 'text-warning' : 'text-error'}`}>
                {formatMoney(soldeCaisse)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Onglets - restreindre l'accès aux onglets financiers */}
      <div className="tabs tabs-boxed justify-center">
        <a 
          className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <Users className="w-4 h-4 mr-2" />
          Membres
        </a>
        {hasFinanceAccess() && (
          <>
            <a 
              className={`tab ${activeTab === "cotisations" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("cotisations")}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Cotisations
            </a>
            <a 
              className={`tab ${activeTab === "depenses" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("depenses")}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Dépenses
            </a>
          </>
        )}
      </div>

      {/* Barre de recherche et actions */}
      <div className="flex justify-between items-center gap-4">
        {activeTab === "members" && (
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="text"
                placeholder="Rechercher un membre..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {/* Bouton d'ajout - conditionné par l'onglet actif et les droits */}
        {activeTab === "members" && (
          <button
            className="btn btn-primary"
            onClick={() => (document.getElementById("member_modal") as HTMLDialogElement)?.showModal()}
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau membre
          </button>
        )}
        
        {hasFinanceAccess() && activeTab === "cotisations" && (
          <button
            className="btn btn-primary"
            onClick={() => (document.getElementById("cotisation_modal") as HTMLDialogElement)?.showModal()}
          >
            <PlusCircle className="w-4 h-4" />
            Enregistrer cotisation
          </button>
        )}
        
        {hasFinanceAccess() && activeTab === "depenses" && (
          <button
            className="btn btn-primary"
            onClick={() => (document.getElementById("depense_modal") as HTMLDialogElement)?.showModal()}
          >
            <PlusCircle className="w-4 h-4" />
            Nouvelle dépense
          </button>
        )}
      </div>

      {/* Tableau des membres - visible par tous */}
      {activeTab === "members" && (
        <div className="rounded-2xl border-2 border-primary/10 bg-primary/5 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom complet</th>
                <th>Catégorie</th>
                <th>Grade</th>
                <th>Date inscription</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, idx) => (
                <tr key={m.id}>
                  <th>{idx + 1}</th>
                  <td className="font-semibold">{m.prenoms} {m.nom}</td>
                  <td>
                    <span className={`badge ${m.categorie === "ADULTE" ? "badge-primary" : "badge-secondary"} w-full h-full`}>
                      {m.categorie}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getGradeBadgeClass(m.grade)}`}>
                      {m.grade}
                    </span>
                  </td>
                  <td>{formatDate(m.date_inscription)}</td>
                  <td>
                    <span className={`badge ${m.statut === "actif" ? "badge-success" : "badge-error"}`}>
                      {m.statut}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-error btn-soft"
                      onClick={() => deleteMember(m.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tableau des cotisations - visible uniquement pour trésorier et président */}
      {hasFinanceAccess() && activeTab === "cotisations" && (
        <div className="rounded-2xl border-2 border-success/10 bg-success/5 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Membre</th>
                <th>Mois</th>
                <th>Année</th>
                <th>Montant</th>
                <th>Date paiement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cotisations.map((c, idx) => (
                <tr key={c.id}>
                  <th>{idx + 1}</th>
                  <td>{c.member_name}</td>
                  <td>{c.mois}</td>
                  <td>{c.annee}</td>
                  <td className="font-semibold text-success">
                    +{formatMoney(c.montant)}
                  </td>
                  <td>{formatDate(c.date_paiement)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error btn-soft"
                      onClick={() => deleteCotisation(c.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tableau des dépenses - visible uniquement pour trésorier et président */}
      {hasFinanceAccess() && activeTab === "depenses" && (
        <div className="rounded-2xl border-2 border-error/10 bg-error/5 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Libellé</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {depenses.map((d, idx) => (
                <tr key={d.id}>
                  <th>{idx + 1}</th>
                  <td>{d.libelle}</td>
                  <td>{d.categorie}</td>
                  <td className="font-semibold text-error">
                    -{formatMoney(d.montant)}
                  </td>
                  <td>{formatDate(d.date_depense)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error btn-soft"
                      onClick={() => deleteDepense(d.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals - restreindre l'accès selon les rôles */}
      <dialog id="member_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Nouveau membre</h3>
          <div className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              placeholder="Nom"
              className="input input-bordered w-full"
              value={newMember.nom}
              onChange={(e) => setNewMember({...newMember, nom: e.target.value})}
            />
            <input
              type="text"
              placeholder="Prénoms"
              className="input input-bordered w-full"
              value={newMember.prenoms}
              onChange={(e) => setNewMember({...newMember, prenoms: e.target.value})}
            />

            <select
              className="select select-bordered w-full"
              value={newMember.categorie}
              onChange={(e) => setNewMember({...newMember, categorie: e.target.value as "ADULTE" | "ENFANT"})}
            >
              <option value="ENFANT">Enfant</option>
              <option value="ADULTE">Adulte</option>
            </select>

            <select
              className="select select-bordered w-full"
              value={newMember.grade}
              onChange={(e) => setNewMember({...newMember, grade: e.target.value as "BLANCHE" | "1ere JAUNE" | "1ere VERTE" | '2ieme VERTE' | '1ere BLEUE' | '2ieme BLEUE' | '3ieme BLEUE' | '1ere ROUGE' | '2ieme ROUGE' | '3ieme ROUGE' | '1ere DAN' | '2ieme DAN' | '3ieme DAN'})}
            >
              <option value="BLANCHE">BLANCHE</option>
              <option value="1ere JAUNE">1ere JAUNE</option>
              <option value="1ere VERTE">1ere VERTE</option>
              <option value="2ieme VERTE">2ieme VERTE</option>
              <option value="1ere BLEUE">1ere BLEUE</option>
              <option value="2ieme BLEUE">2ieme BLEUE</option>
              <option value="3ieme BLEUE">3ieme BLEUE</option>
              <option value="1ere ROUGE">1ere ROUGE</option>
              <option value="2ieme ROUGE">2ieme ROUGE</option>
              <option value="3ieme ROUGE">3ieme ROUGE</option>
              <option value="1ere DAN">1ere DAN</option>
              <option value="2ieme DAN">2ieme DAN</option>
              <option value="3ieme DAN">3ieme DAN</option>
            </select>

            <button className="btn btn-primary" onClick={addMember} disabled={load}>
              <UserPlus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>
      </dialog>

      {hasFinanceAccess() && (
        <>
          <dialog id="cotisation_modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-bold text-lg">Enregistrer une cotisation</h3>
              <div className="flex flex-col gap-4 mt-4">
                <select
                  className="select select-bordered w-full"
                  value={newCotisation.member_id}
                  onChange={(e) => setNewCotisation({...newCotisation, member_id: e.target.value})}
                >
                  <option value="">Sélectionner un membre</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.prenoms} {m.nom}</option>
                  ))}
                </select>
                <select
                  className="select select-bordered w-full"
                  value={newCotisation.mois}
                  onChange={(e) => setNewCotisation({...newCotisation, mois: e.target.value})}
                >
                  <option value="">Sélectionner le mois</option>
                  {["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Montant"
                  className="input input-bordered w-full"
                  value={newCotisation.montant || ""}
                  onChange={(e) => setNewCotisation({...newCotisation, montant: parseInt(e.target.value) || 0})}
                />
                <button className="btn btn-success" onClick={addCotisation} disabled={load}>
                  <CreditCard className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </dialog>

          <dialog id="depense_modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-bold text-lg">Nouvelle dépense</h3>
              <div className="flex flex-col gap-4 mt-4">
                <input
                  type="text"
                  placeholder="Libellé"
                  className="input input-bordered w-full"
                  value={newDepense.libelle}
                  onChange={(e) => setNewDepense({...newDepense, libelle: e.target.value})}
                />
                <select
                  className="select select-bordered w-full"
                  value={newDepense.categorie}
                  onChange={(e) => setNewDepense({...newDepense, categorie: e.target.value})}
                >
                  <option value="">Catégorie</option>
                  <option value="Matériel">Matériel</option>
                  <option value="Location">Location</option>
                  <option value="Déplacement">Déplacement</option>
                  <option value="Compétition">Compétition</option>
                  <option value="Autre">Autre</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Montant"
                  className="input input-bordered w-full"
                  value={newDepense.montant || ""}
                  onChange={(e) => setNewDepense({...newDepense, montant: parseInt(e.target.value) || 0})}
                />

                <button className="btn btn-error" onClick={addDepense} disabled={load}>
                  <ShoppingCart className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}