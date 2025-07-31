export interface Place {
    id: number;
    heure_entree: Date;
    heure_sortie: Date;
    statut: string;
    parking: {
        id: number;
        libelle: string;
    };
    vehicule: number;
}


