import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parking } from './parking.model';

@Injectable({ providedIn: 'root' })
export class ParkingService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getParkings(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page, limit: limit,
            libelle: data.libelle,
            description: data.description ?? '',
            statut: data.statut ?? '',
            date_debut: data.date_debut ?? '',
            date_fin: data.date_fin ?? '',
            uo_parking: data.uo_parking ?? '',
            localite: data.localite ?? ''
        }
        console.log(data);
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/parking/', option);
    }

    getParkingsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/parking/' + id + '/');
    }

    createParking(parking: Parking): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/parking/', parking);
    }
      

    updateParking(id: number, parking: Parking): Observable<any> { // UPDATE
        return this.http.put<any>(this.apiUrl + '/api/parking/' + id + '/', parking);
    }

    deleteParking(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/parking/' + id + '/');
    }
      
    
}
