export type UserRole = 'membre' | 'tresorier' | 'president'


export type User = {
    avatar: any;
    id:string;
    email:string;
    nom:string
    prenom:string
    role:UserRole
    member_id?:string
    date_inscription?:string
    dernier_acces?:string
    actif:boolean
}


export type AuthContextType = {
    user : User | null;
    isLoading: boolean;
    login:(email:string, password:string) => Promise<void>;
    logout: () => void;
    hasPermission: (Required: UserRole) => boolean;
    hasAnyPermission:(roles: UserRole[]) => boolean;
    updateUserRole: (userId: string, newRole:UserRole) => Promise<void>;


};