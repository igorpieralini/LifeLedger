import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { GoalResponse } from './dashboard-api.service';

export type GoalCategory = 'CAREER' | 'FINANCE' | 'STUDIES' | 'GROWTH';

export interface GoalRequest {
  title: string;
  description?: string;
  year: number;
  financial?: boolean;
  category?: GoalCategory;
  icon?: string;
  color?: string;
  targetValue?: number;
  deadline?: string;
}

export interface ProgressUpdateRequest {
  currentValue: number;
}

@Injectable({ providedIn: 'root' })
export class GoalApiService {
  constructor(private api: ApiService) {}

  create(data: GoalRequest): Observable<GoalResponse> {
    return this.api.post<GoalResponse>('/goals', data);
  }

  list(year?: number, category?: GoalCategory): Observable<GoalResponse[]> {
    const params: Record<string, string | number> = {};
    if (year != null) params['year'] = year;
    if (category) params['category'] = category;
    return this.api.get<GoalResponse[]>('/goals', params);
  }

  getById(id: number): Observable<GoalResponse> {
    return this.api.get<GoalResponse>(`/goals/${id}`);
  }

  update(id: number, data: GoalRequest): Observable<GoalResponse> {
    return this.api.put<GoalResponse>(`/goals/${id}`, data);
  }

  updateProgress(id: number, data: ProgressUpdateRequest): Observable<GoalResponse> {
    return this.api.patch<GoalResponse>(`/goals/${id}/progress`, data);
  }

  updateStatus(id: number, status: string): Observable<GoalResponse> {
    return this.api.patch<GoalResponse>(`/goals/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/goals/${id}`);
  }
}
