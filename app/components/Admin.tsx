"use client"

import api from '@/app/API'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'
import { useAuth } from '@/app/contexts/AuthContext'
import { User, UserRole } from '@/app/types/auth'
import { Edit, Save, Shield, Trash, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function GestionUser() {

    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [edittingUser, setEdittingUser] = useState<string | null>(null)
    const [editRole, setEditRole] = useState<UserRole>("membre")
    const [newUser, setNewUser] = useState({

        email:'',
        nom:'',
        prenom:'',
        role:"membre" as UserRole,
        password: "",
        
    })

    useEffect(() => {
        loadUser()
    }, [])


    const loadUser = async () => {

        try {

            const response = await api.get("users/");
            setUsers(response.data);
            console.log(response.data) 
        } catch (error) {

          toast.error("Erreur lord du chargement des utilisateurs")
          console.error(error)
          
            
        }
    }

    const addUser = async() => {
        if(!newUser.email ||  !newUser.password || !newUser.nom || !newUser.prenom) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        try {
            await api.post("users/", newUser)
            await loadUser()

            toast.success("Utilisateur ajoute avec success")

          setNewUser({

              email:'',
              nom:'',
              prenom:'',
              role:"membre",
              password: ""

          })

            (document.getElementById("user_modal") as HTMLDialogElement )?.close();
        } catch (error) {
            toast.error("Erreur lors de l'ajout de l'utilisateur")
            console.log("Erreur lors de l'ajout de la suppression", error)

            
        }
    }

    const updateRole = async(userId: string, role: UserRole) => {
        try {

            await api.patch(`users/${userId}/`, { role})
            await loadUser()
            toast.success("Role mis a jour avec success")
            setEdittingUser(null)
            
        } catch (error) {
            toast.error("Erreur lors de la mis a jour")
            console.log(error)
            
        }

    }


    const deleteUser = async(userId: string) => {
        if (userId === currentUser?.id) {
            toast.error("Vous ne pouvez pas supprimer votre propre compte")
            return;
        }

        if(confirm("Supprimer cet Utilisateur?")) {


            try {

                await api.delete(`users/${userId}/`)
                await loadUser()
                toast.success("Utilisateur supprimé avec success")
                
            } catch (error) {
                toast.error("Erreur lors de la suppression de ce utilisateur")
                console.error(error)

                
            }

        }
    }

  
return (
    <ProtectedRoute requiredRole="president">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Gestion des utilisateurs
          </h1>
          <button 
            className="btn btn-primary"
            onClick={() => (document.getElementById("user_modal") as HTMLDialogElement)?.showModal()}
          >
            Nouvel utilisateur
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date d inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="font-semibold">{user.prenom} {user.nom}</td>
                  <td>{user.email}</td>
                  <td>
                    {edittingUser === user.id ? (
                      <select 
                        className="select select-bordered select-sm"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                      >
                        <option value="membre">Membre</option>
                        <option value="tresorier">Trésorier</option>
                        <option value="president">Président</option>
                      </select>
                    ) : (
                      <span className={`badge ${
                        user.role === 'president' ? 'badge-warning' :
                        user.role === 'tresorier' ? 'badge-success' :
                        'badge-primary'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>{new Date(user?.date_inscription).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    {edittingUser === user.id ? (
                      <>
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => updateRole(user.id, editRole)}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => setEdittingUser(null)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setEdittingUser(user.id);
                            setEditRole(user.role);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="btn btn-sm btn-error"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal ajout utilisateur */}
        <dialog id="user_modal" className="modal">
          <div className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            <h3 className="font-bold text-lg">Nouvel utilisateur</h3>
            <div className="flex flex-col gap-4 mt-4">
              <input
                type="text"
                placeholder="Nom"
                className="input input-bordered w-full"
                value={newUser.nom}
                onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
              />
              <input
                type="text"
                placeholder="Prénoms"
                className="input input-bordered w-full"
                value={newUser.prenom}
                onChange={(e) => setNewUser({...newUser, prenom: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                className="input input-bordered w-full"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
              <select
                className="select select-bordered w-full"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
              >
                <option value="membre">Membre</option>
                <option value="tresorier">Trésorier</option>
                <option value="president">Président</option>
              </select>
              <button className="btn btn-primary" onClick={addUser}>
                Ajouter
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </ProtectedRoute>
  );
}


