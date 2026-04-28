import { Crown, User, Wallet } from 'lucide-react'
import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'



const roleIcons = {
    membre:User,
    tresorier:Wallet,
    president:Crown
}

const roleColors = {
    membre:"badge-primary",
    tresorier:'badge-success',
    president:"badge-warning"
}

const Header = () => {

    const { user, logout } = useAuth()
    const router = useRouter();

    const RoleIcon = user ? roleIcons[user.role] : User;



     return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" href="/">
        Club Management
        </Link>
      </div>
      
      <div className="flex-none gap-2">
        {user && (
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <RoleIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user.prenom} {user.nom}</span>
              </li>
              <li>
                <span className={`badge ${roleColors[user.role]} w-full justify-center`}>
                  {user.role.toUpperCase()}
                </span>
              </li>
              <li>
                <span className="text-xs opacity-70">{user.email}</span>
              </li>
              <div className="divider my-1"></div>
              <li onClick={() => router.push("/profile")}>
                <a>Mon profil</a>
              </li>
              {user.role === 'president' && (
                <li onClick={() => router.push("/admin/users")}>
                  <a>Gestion des utilisateurs</a>
                </li>
              )}
              <li onClick={logout}>
                <a className="text-error">Déconnexion</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}



export default Header
