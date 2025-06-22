import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Localite } from './localite.model'; 

@Injectable({ providedIn: 'root' })
export class LocaliteService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getLocalites(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page, limit: limit,
            libelle: data.libelle ?? '',
            type_localite: data.type_localite ?? '',
            parent_id: data.parent_id ?? '',
            search: data.search ?? ''
        }
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/localite/', option);
    }

    getLocalitesById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/localite/' + id);
    }

    createLocalite(localite: Localite): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/localite/', localite);
    }
      

    updateLocalite(id: number, localite: Localite): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/localite/' + id + '/', localite);
      }

    deleteLocalite(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/localite/' + id + '/');
    }
      
    
}
