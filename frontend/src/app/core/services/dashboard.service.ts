import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import { Dashboard } from '../models/dashboard.model';
import { MOCK_DASHBOARD } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get<Dashboard>(`${environment.apiUrl}/dashboard`).pipe(
      catchError(() => of(MOCK_DASHBOARD))
    );
  }
}
