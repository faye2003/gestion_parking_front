import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ParametreService {
    apiUrl: string = environment.apiUrl;

    constructor(public httpClient: HttpClient) { }

}
