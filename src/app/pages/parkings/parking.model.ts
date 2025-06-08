export interface Parking {
    id: number;
    libelle: string;
    description: string;
    nombre_place: number;
    statut: string;
    localite_id:number;
    place_id: number;
    localite: {
        id: number;
        libelle: string;
    }
    place: {
        id: number;
    }
}
