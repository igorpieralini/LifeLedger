import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Goal, GoalCategory, GoalRequest, GoalStatus } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/goals';

  list(category?: GoalCategory) {
    const url = category ? `${this.base}?category=${category}` : this.base;
    return this.http.get<Goal[]>(url);
  }

  create(request: GoalRequest) {
    return this.http.post<Goal>(this.base, request);
  }

  update(id: number, request: GoalRequest) {
    return this.http.put<Goal>(`${this.base}/${id}`, request);
  }

  updateStatus(id: number, status: GoalStatus) {
    return this.http.patch<Goal>(`${this.base}/${id}/status`, { status });
  }

  updateProgress(id: number, progress: number) {
    return this.http.patch<Goal>(`${this.base}/${id}/progress`, { progress });
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
