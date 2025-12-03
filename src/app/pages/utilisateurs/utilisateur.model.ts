import { Profil } from "../parametres/profil/profil.model";

export interface Utilisateur {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    password?: string;
    telephone: string;
    adresse: string;
    statut: string;
    profil: {
        id: number;
        libelle: string
    };
    profils: Profil[];
    localite_id: number; 
    localite: {
        id: number;
        libelle: string
    };
}
