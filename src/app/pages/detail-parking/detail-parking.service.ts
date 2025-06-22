import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailParking } from './detail-parking.model';

@Injectable({ providedIn: 'root' })
export class DetailParkingService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getDetailParkings(page: number, limit: number, data: any): Observable<any> {
        let dataParams = {
            page: page, limit: limit,
            libelle: data.libelle ?? '',
            type_uo: data.type_uo ?? '',
            parent: data.parent_id ?? '',
            localite: data.localite_id ?? '',
            search: data.search ?? ''
        }
        let reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
        let option = { headers: reqHeader, params: dataParams }
        console.log(this.apiUrl);
        return this.http.get<any>(this.apiUrl + '/api/parking', option);
    }

    getDetailParkingsById(id: number): Observable<any> {
        return this.http.get<any>(this.apiUrl + '/api/parking/' + id + '/');
    }

    createDetailParking(parking: DetailParking): Observable<any> { // CREATE
        return this.http.post<any>(this.apiUrl + '/api/parking/', parking);
    }
      

    openparking(id: number): Observable<any> { // OPEN
        return this.http.put<any>(this.apiUrl + '/api/parking/' + id + '/open', {});
    }
    
    closeparking(id: number): Observable<any> { // CLOSE
        return this.http.put<any>(this.apiUrl + '/api/parking/' + id + '/close', {});
    }

    deleteDetailParking(id: number): Observable<any> { // DELETE
        // console.log(this.apiUrl);
        return this.http.delete<any>(this.apiUrl + '/api/parking/' + id);
    }
      
    
}
