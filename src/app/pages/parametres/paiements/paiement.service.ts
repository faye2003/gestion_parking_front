import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paiement } from './paiement.model';

@Injectable({ providedIn: 'root' })
export class PaiementService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getPaiements(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page,
            limit: limit,
            search: data.search ?? ''
        }
        console.log(data);
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/paiement/', option);
    }

    getPaiementsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/paiement/' + id);
    }

    createPaiement(paiement: Paiement): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/paiement/', paiement);
    }
      

    updatePaiement(id: number, paiement: Paiement): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/paiement/' + id, paiement);
      }

    deletePaiement(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/paiement/' + id);
    }
      
    
}
