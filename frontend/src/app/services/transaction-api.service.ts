import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TransactionResponse } from './dashboard-api.service';

export interface TransactionRequest {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  categoryId?: number;
  notes?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface FinanceSummaryResponse {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expensesByCategory: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  categoryName: string;
  categoryColor: string;
  total: number;
  percentage: number;
}

export interface FinanceLimitsResponse {
  year: number;
  month: number;
  categories: CategoryLimitStatus[];
}

export interface CategoryLimitStatus {
  categoryName: string;
  limitAmount: number;
  spent: number;
  remaining: number;
  usedPercentage: number;
  exceeded: boolean;
}

@Injectable({ providedIn: 'root' })
export class TransactionApiService {
  constructor(private api: ApiService) {}

  create(data: TransactionRequest): Observable<TransactionResponse> {
    return this.api.post<TransactionResponse>('/transactions', data);
  }

  list(page = 0, size = 20): Observable<Page<TransactionResponse>> {
    return this.api.get<Page<TransactionResponse>>('/transactions', { page, size });
  }

  history(): Observable<TransactionResponse[]> {
    return this.api.get<TransactionResponse[]>('/transactions/history');
  }

  getById(id: number): Observable<TransactionResponse> {
    return this.api.get<TransactionResponse>(`/transactions/${id}`);
  }

  update(id: number, data: TransactionRequest): Observable<TransactionResponse> {
    return this.api.put<TransactionResponse>(`/transactions/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/transactions/${id}`);
  }

  summary(year: number, month: number): Observable<FinanceSummaryResponse> {
    return this.api.get<FinanceSummaryResponse>('/transactions/summary', { year, month });
  }

  limits(year: number, month: number): Observable<FinanceLimitsResponse> {
    return this.api.get<FinanceLimitsResponse>('/transactions/limits', { year, month });
  }

  importCsv(file: File): Observable<any> {
    return this.api.upload('/transactions/import', file);
  }

  importPdf(file: File): Observable<any> {
    return this.api.upload('/transactions/import/pdf', file);
  }
}
