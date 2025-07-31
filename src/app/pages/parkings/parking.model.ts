export interface Parking {
    id: number;
    libelle: string;
    description: string;
    total_places: number;
    statut: string;
    localite_id: number;
    localite: {
        id:number;
        libelle:string;
    };
}
