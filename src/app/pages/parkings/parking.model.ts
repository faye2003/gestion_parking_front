export interface Parking {
    id: number;
    libelle: string;
    description: string;
    total_places: number;
    statut: string;
    localite: {
        id:number;
        libelle:string;
    };
}
