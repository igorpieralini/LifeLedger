import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CategoryLimitResponse {
  id: number;
  categoryName: string;
  limitAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryLimitRequest {
  categoryName: string;
  limitAmount: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryLimitApiService {
  constructor(private api: ApiService) {}

  list(): Observable<CategoryLimitResponse[]> {
    return this.api.get<CategoryLimitResponse[]>('/category-limits');
  }

  getById(id: number): Observable<CategoryLimitResponse> {
    return this.api.get<CategoryLimitResponse>(`/category-limits/${id}`);
  }

  create(data: CategoryLimitRequest): Observable<CategoryLimitResponse> {
    return this.api.post<CategoryLimitResponse>('/category-limits', data);
  }

  update(id: number, data: CategoryLimitRequest): Observable<CategoryLimitResponse> {
    return this.api.put<CategoryLimitResponse>(`/category-limits/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/category-limits/${id}`);
  }
}
