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

export interface TransactionFilter {
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionApiService {
  constructor(private api: ApiService) {}

  create(data: TransactionRequest): Observable<TransactionResponse> {
    return this.api.post<TransactionResponse>('/transactions', data);
  }

  list(page = 0, size = 20, filters?: TransactionFilter): Observable<Page<TransactionResponse>> {
    const params: Record<string, string | number> = { page, size };
    if (filters) {
      if (filters.type) params['type'] = filters.type;
      if (filters.categoryId) params['categoryId'] = filters.categoryId;
      if (filters.dateFrom) params['dateFrom'] = filters.dateFrom;
      if (filters.dateTo) params['dateTo'] = filters.dateTo;
      if (filters.minAmount != null) params['minAmount'] = filters.minAmount;
      if (filters.maxAmount != null) params['maxAmount'] = filters.maxAmount;
    }
    return this.api.get<Page<TransactionResponse>>('/transactions', params);
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
