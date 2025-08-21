import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contact } from './contact.model'; 

@Injectable({ providedIn: 'root' })
export class ContactService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getContacts(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page,
            limit: limit,
            search: data.search ?? ''
        }
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/contact/', option);
    }

    getContactsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/contact/' + id);
    }

    createContact(contact: Contact): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/contact/', contact);
    }
      

    updateContact(id: number, contact: Contact): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/contact/' + id + '/', contact);
    }

    deleteContact(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/contact/' + id + '/');
    }
      
    
}
