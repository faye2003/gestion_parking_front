import { Place } from "../places/place.model";

export interface DetailParking {
    id: number;
    libelle: string;
    description: string;
    total_places: number;
    places_libres:number;
    places_occupees:number;
    date_creation:Date;
    date_modification:Date;
    statut: string;
    localite: {
        id:number;
        libelle:string;
        latitude:number;
        longitude:number;
    };
    places: Place[];
}

