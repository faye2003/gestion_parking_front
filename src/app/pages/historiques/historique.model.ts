export interface Historique {
    id: number;
    vehicule: {
        immatricule: string,
        couleur: string,
        marque: string
    };
    place: number;
    date_entree: Date;
    date_sortie: Date;
}
