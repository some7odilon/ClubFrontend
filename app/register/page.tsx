"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import api from "../API";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "membre",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nom || !form.prenom || !form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("les mots de passe ne correspondent pas");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        toast.error("Veuillez entrer un email valide");
        return;
    }

      setLoading(true);
    

    try {
      const response = await api.post("auth/register", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      toast.success(
        "Inscription réussie! Vous pouvez maintenat vous connecter",
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Erreur d'inscription:", error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Inscription</h2>
            <p className="text-sm opacity-70 mt-2">Créez votre compte membre</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  className="input input-bordered w-full pl-10"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Prénom</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Votre prénom"
                  className="input input-bordered w-full pl-10"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  className="input input-bordered w-full pl-10"
                  value={form.email}
                  onChange={handleChange}
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-10"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 opacity-50" />
                  ) : (
                    <Eye className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </div>
              <label className="label">
                <span className="label-text-alt text-xs">
                  Minimum 6 caractères
                </span>
              </label>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Confirmer le mot de passe</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-10"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setshowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 opacity-50" />
                  ) : (
                    <Eye className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </div>
            </div>

            {/* Champ rôle caché ou désactivé pour les nouveaux inscrits */}
            <input type="hidden" name="role" value="membre" />

            <div className="alert alert-info mt-4 text-xs">
              <Shield className="w-4 h-4" />
              <span>
                Par défaut, vous êtes inscrit en tant que MEMBRE. Seuls les
                administrateurs peuvent attribuer des rôles supérieurs.
              </span>
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
                  <UserPlus className="w-4 h-4" />
                  Sinscrire
                </>
              )}
            </button>
          </form>

          <div className="divider">ou</div>

          <div className="text-center">
            <p className="text-sm">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
