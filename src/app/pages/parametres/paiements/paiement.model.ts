export interface Paiement {
    id: number;
    description: string;
    montant: string;
    statut: string;
    date: string;
    type_paiement_id: number;
    type_paiement: {
        id: number;
        libelle: string
    };
    user: {
        id: number;
        nom: string
    };
}
