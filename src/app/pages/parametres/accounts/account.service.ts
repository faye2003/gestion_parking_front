import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from './account.model'; 

@Injectable({ providedIn: 'root' })
export class AccountService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAccounts(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page, limit: limit,
            libelle: data.libelle ?? '',
            solde: data.solde ?? '',
            solde_avant: data.solde_avant ?? '',
            uo_id: data.uo_id ?? '',
            search: data.search ?? ''
        }
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/account/', option);
    }

    getAccountsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/account/' + id);
    }

    createAccount(account: Account): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/account/', account);
    }
      

    updateAccount(id: number, account: Account): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/account/' + id, account);
      }

    deleteAccount(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/account/' + id);
    }
      
    
}
