import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import {
  Category, CategoryRequest, CsvImportResult, FinanceSummary,
  Page, Transaction, TransactionRequest
} from '../models/finance.model';
import { MOCK_CATEGORIES, MOCK_FINANCE_SUMMARY, MOCK_TRANSACTIONS_PAGE } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly txApi  = `${environment.apiUrl}/transactions`;
  private readonly catApi = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // ── Transactions ──────────────────────────────────────────────────────────

  createTransaction(request: TransactionRequest) {
    return this.http.post<Transaction>(this.txApi, request);
  }

  getTransactions(page = 0, size = 20) {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', 'date,desc');
    return this.http.get<Page<Transaction>>(this.txApi, { params }).pipe(
      catchError(() => of(MOCK_TRANSACTIONS_PAGE))
    );
  }

  getTransaction(id: number) {
    return this.http.get<Transaction>(`${this.txApi}/${id}`);
  }

  updateTransaction(id: number, request: TransactionRequest) {
    return this.http.put<Transaction>(`${this.txApi}/${id}`, request);
  }

  deleteTransaction(id: number) {
    return this.http.delete<void>(`${this.txApi}/${id}`);
  }

  getSummary(year: number, month: number) {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<FinanceSummary>(`${this.txApi}/summary`, { params }).pipe(
      catchError(() => of({ ...MOCK_FINANCE_SUMMARY, year, month }))
    );
  }

  importCsv(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<CsvImportResult>(`${this.txApi}/import`, form);
  }

  importPdf(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<CsvImportResult>(`${this.txApi}/import/pdf`, form);
  }

  // ── Categories ────────────────────────────────────────────────────────────

  createCategory(request: CategoryRequest) {
    return this.http.post<Category>(this.catApi, request);
  }

  getCategories() {
    return this.http.get<Category[]>(this.catApi).pipe(
      catchError(() => of(MOCK_CATEGORIES))
    );
  }

  updateCategory(id: number, request: CategoryRequest) {
    return this.http.put<Category>(`${this.catApi}/${id}`, request);
  }

  deleteCategory(id: number) {
    return this.http.delete<void>(`${this.catApi}/${id}`);
  }
}
