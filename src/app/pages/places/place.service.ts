import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Place } from './place.model';

@Injectable({ providedIn: 'root' })
export class PlaceService {
    
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getPlaces(page: number, limit: number, data: any): Observable<any> {
        const dataParams = {
            page,
            limit,
            search: data.search || ''
        };
        
        const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options = { headers: reqHeader, params: dataParams };
        
        return this.http.get<any>(`${this.apiUrl}/api/place`, options);
    }

    getPlaceById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/place/${id}/`);
    }

    createPlace(place: Place): Observable<any> {
        return this.http.post<any>(this.apiUrl + '/api/place/', place);
    }

    updatePlace(id: number, place: Place): Observable<any> {
        return this.http.put(`${this.apiUrl}/place/${id}/`, place);
    }

    deletePlace(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/place/${id}/`);
    }

    getCampagnes(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/campagnes`);
    }

    getDemandes(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/demandes`);
    }
}
