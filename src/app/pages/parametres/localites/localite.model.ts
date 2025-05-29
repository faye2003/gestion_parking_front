export interface Localite {
    id: number;
    libelle: string;
    type_localite_id: number;
    parent_id: number;
    type_localite: {
        id:number;
        libelle:string;
    };
    parent:{
        id:number;
        libelle:string;
    }
}
