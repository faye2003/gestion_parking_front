export interface Utilisateur {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    password?: string;
    telephone: string;
    adresse: string;
    profil: number;
    localite_id: number; 
    localite: {
        id: number;
        libelle: string
    };
}
