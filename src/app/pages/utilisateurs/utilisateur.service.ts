import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from './utilisateur.model';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UserService {
  apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient, @Inject(PLATFORM_ID) private readonly platformId: Object) { }

  getUsers(page: number, limit: number, data: any): Observable<any> {
    let dataParams = {
      page: page, limit: limit,
      firstName: data.firstName ?? '',
      email: data.email ?? '',
      lastName: data.lastName ?? '',
      search: data.search ?? ''
    }
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : '';
    console.log(token)
    let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
		let option = { headers: reqHeader, params: dataParams }
    return this.http.get<Utilisateur>(this.apiUrl + '/api/users', option);
  }

  getUserById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(this.apiUrl + '/api/users/' + id);
  }

  addUser(data: any): Observable<any> {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : '';
    let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    let option = { headers: reqHeader }
    return this.http.post<Utilisateur>(this.apiUrl + '/api/users', data, option)
  }

  editUser(id: number, data: any) {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : '';
    let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    let option = { headers: reqHeader }
    return this.http.put<Utilisateur>(this.apiUrl + '/api/users/' + id, data, option)
  }

  deleteUser(id: number) {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : '';
    let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    let option = { headers: reqHeader }
    return this.http.delete<Utilisateur>(this.apiUrl + '/api/users/' + id, option)
  }

  changeStatutUser(id: number, etat: any) {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : '';
    let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    let option = { headers: reqHeader }
    return this.http.put<Utilisateur>(this.apiUrl + '/api/user/enabled/' + id, { etat: etat }, option)
  }
}
