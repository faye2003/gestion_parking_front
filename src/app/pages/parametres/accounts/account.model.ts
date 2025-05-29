export interface Account {
    id: number;
    libelle: string;
    solde: string;
    solde_avant: string;
    date_last_modification: string;
    uo_id:number;
    type_account_id: number;
    uo: {
        id:number;
        libelle:string;
    };
    type_account:{
        id:number;
        libelle:string;
    };
}
