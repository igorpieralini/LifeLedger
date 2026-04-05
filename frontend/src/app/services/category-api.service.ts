import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CategoryRequest {
  name: string;
  type: 'FIXED' | 'VARIABLE';
  color?: string;
  icon?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  type: 'FIXED' | 'VARIABLE';
  color: string | null;
  icon: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  constructor(private api: ApiService) {}

  create(data: CategoryRequest): Observable<CategoryResponse> {
    return this.api.post<CategoryResponse>('/categories', data);
  }

  list(): Observable<CategoryResponse[]> {
    return this.api.get<CategoryResponse[]>('/categories');
  }

  update(id: number, data: CategoryRequest): Observable<CategoryResponse> {
    return this.api.put<CategoryResponse>(`/categories/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
