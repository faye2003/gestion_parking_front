import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeAccount } from './type-account.model'; 

@Injectable({ providedIn: 'root' })
export class TypeAccountService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getTypeAccounts(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page, limit: limit,
            libelle: data.libelle ?? '',
            parent_id: data.parent_id ?? '',
            search: data.search ?? ''
        }
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/type_account/', option);
    }

    getTypeAccountsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/type_account/' + id);
    }

    createTypeAccount(type_account: TypeAccount): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/type_account/', type_account);
    }
      

    updateTypeAccount(id: number, type_account: TypeAccount): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/type_account/' + id, type_account);
      }

    deleteTypeAccount(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/type_account/' + id);
    }
      
    
}
