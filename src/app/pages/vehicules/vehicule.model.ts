export interface Vehicule {
    id: number;
    marque: string;
    immatricule: string;
    couleur: number;
    parking_id: number;
    account_id: number;
    user_id: number;
    parking: {
        id: number;
        libelle: string
    };
    account: {
        id: number;
        libelle: string;
    };
    user: {
        id: number;
        nom: string
    };
}
