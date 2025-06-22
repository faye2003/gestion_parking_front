import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profil } from './profil.model';

@Injectable({ providedIn: 'root' })
export class ProfilService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getProfils(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page, limit: limit,
            nom: data.nom ?? '',
            parent_id: data.parent_id ?? '',
            search: data.search ?? ''
        }
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/profil/', option);
    }

    getProfilsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/profil/' + id);
    }

    createProfil(profil: Profil): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/profil/', profil);
    }
      

    updateProfil(id: number, profil: Profil): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/profil/' + id + '/', profil);
    }

    deleteProfil(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/profil/' + id + '/');
    }
      
    
}
