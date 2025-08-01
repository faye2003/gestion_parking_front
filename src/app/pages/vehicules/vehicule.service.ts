import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vehicule } from './vehicule.model';

@Injectable({ providedIn: 'root' })
export class VehiculeService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getVehicules(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page,
            limit: limit,
            search: data.search ?? ''
        }
        console.log(data);
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/vehicule/', option);
    }

    getVehiculesById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/vehicule/' + id);
    }

    createVehicule(vehicule: Vehicule): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/vehicule/', vehicule);
    }
      

    updateVehicule(id: number, vehicule: Vehicule): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/vehicule/' + id, vehicule);
      }

    deleteVehicule(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/vehicule/' + id);
    }
      
    
}
