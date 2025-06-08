import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypePaiement } from './type-paiement.model';

@Injectable({ providedIn: 'root' })
export class TypePaiementService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getTypePaiements(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page, limit: limit,
            libelle: data.libelle ?? '',
            parent_id: data.parent_id ?? '',
            search: data.search ?? ''
        }
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/type_paiement/', option);
    }

    getTypePaiementsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/type_paiement/' + id);
    }

    createTypePaiement(type_paiement: TypePaiement): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/type_paiement/', type_paiement);
    }
      

    updateTypePaiement(id: number, type_paiement: TypePaiement): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/type_paiement/' + id, type_paiement);
      }

    deleteTypePaiement(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/type_paiement/' + id);
    }
      
    
}
