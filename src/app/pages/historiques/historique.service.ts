import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Historique } from './historique.model';

@Injectable({ providedIn: 'root' })
export class HistoriqueService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getHistoriques(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page,
            limit: limit,
            search: data.search ?? ''
        }
        console.log(data);
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/historique/', option);
    }

    getHistoriquesById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/historique/' + id + '/');
    }

    createHistorique(historique: Historique): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/historique/', historique);
    }
      

    updateHistorique(id: number, historique: Historique): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/historique/' + id + '/', historique);
      }

    deleteHistorique(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/historique/' + id + '/');
    }
      
    
}
