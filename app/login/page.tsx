"use client";

import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, Shield } from "lucide-react";

const page = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [loading, setLoading]  = useState(false)
    const { login } = useAuth();
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        try {

            await login(email, password);
            router.push("/")
            
        } catch (error) {
            console.log(error)
            
        } finally {
            setLoading(false)
        }
    }

 
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Gestion du Club</h2>
            <p className="text-sm opacity-70">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="input input-bordered w-full pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="password"
                  placeholder="entrer votre mot de passe"
                  className="input input-bordered w-full pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default page
