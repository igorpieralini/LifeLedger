import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FinanceRecord, FinanceRecordRequest } from '../models/finance.model';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/finance-records';

  getByMonth(year: number, month: number) {
    return this.http.get<FinanceRecord>(`${this.base}?year=${year}&month=${month}`, {
      observe: 'response',
    });
  }

  save(request: FinanceRecordRequest) {
    return this.http.put<FinanceRecord>(this.base, request);
  }

  listAll() {
    return this.http.get<FinanceRecord[]>(`${this.base}/all`);
  }
}
