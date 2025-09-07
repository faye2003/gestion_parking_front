import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardSummary, Mouvement, Series } from './dashboard.model';
// dashboard.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  summary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.base}/api/dashboard/summary`);
  }
  mouvements(limit=10): Observable<Mouvement[]> {
    return this.http.get<Mouvement[]>(`${this.base}/api/mouvements`, { params: { limit } as any });
  }
  occupancy(range='day'): Observable<Series> {
    return this.http.get<Series>(`${this.base}/api/stats/occupancy`, { params: { range } as any });
  }
  revenues(range='month'): Observable<Series> {
    return this.http.get<Series>(`${this.base}/api/stats/revenues`, { params: { range } as any });
  }

  // WebSocket temps réel (optionnel)
  liveEvents(): Observable<Mouvement> {
    return new Observable(obs => {
      const ws = new WebSocket(environment.apiUrl + '/ws/events/parking/');
      ws.onmessage = evt => obs.next(JSON.parse(evt.data));
      ws.onerror = err => obs.error(err);
      ws.onclose = () => obs.complete();
      return () => ws.close();
    });
  }
}
