import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import {
  Category, CategoryLimit, CategoryLimitRequest, CategoryRequest, CsvImportResult, FinanceLimits, FinanceSummary,
  Page, Transaction, TransactionRequest
} from '../models/finance.model';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly txApi  = `${environment.apiUrl}/transactions`;
  private readonly catApi = `${environment.apiUrl}/categories`;
  private readonly categoryLimitApi = `${environment.apiUrl}/category-limits`;

  constructor(private http: HttpClient) {}

  // ── Transactions ──────────────────────────────────────────────────────────

  createTransaction(request: TransactionRequest) {
    return this.http.post<Transaction>(this.txApi, request);
  }

  getTransactions(page = 0, size = 20) {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', 'date,desc');
    return this.http.get<Page<Transaction>>(this.txApi, { params });
  }

  getTransactionHistory() {
    return this.http.get<Transaction[]>(`${this.txApi}/history`);
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
    return this.http.get<FinanceSummary>(`${this.txApi}/summary`, { params });
  }

  getLimits(year: number, month: number) {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<FinanceLimits>(`${this.txApi}/limits`, { params });
  }

  getCategoryLimits() {
    return this.http.get<CategoryLimit[]>(this.categoryLimitApi);
  }

  updateCategoryLimit(id: number, request: CategoryLimitRequest) {
    return this.http.put<CategoryLimit>(`${this.categoryLimitApi}/${id}`, request);
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
    return this.http.get<Category[]>(this.catApi);
  }

  updateCategory(id: number, request: CategoryRequest) {
    return this.http.put<Category>(`${this.catApi}/${id}`, request);
  }

  deleteCategory(id: number) {
    return this.http.delete<void>(`${this.catApi}/${id}`);
  }
}
