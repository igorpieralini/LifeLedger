import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Goal, GoalRequest, GoalStatus, ProgressUpdateRequest, SubGoal, SubGoalRequest } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private readonly api = `${environment.apiUrl}/goals`;
  private readonly subApi = `${environment.apiUrl}/sub-goals`;

  constructor(private http: HttpClient) {}

  // ── Goals ─────────────────────────────────────────────────────────────────

  create(request: GoalRequest) {
    return this.http.post<Goal>(this.api, request);
  }

  findAll(year?: number) {
    const params = year ? new HttpParams().set('year', year) : undefined;
    return this.http.get<Goal[]>(this.api, { params });
  }

  findById(id: number) {
    return this.http.get<Goal>(`${this.api}/${id}`);
  }

  update(id: number, request: GoalRequest) {
    return this.http.put<Goal>(`${this.api}/${id}`, request);
  }

  updateProgress(id: number, request: ProgressUpdateRequest) {
    return this.http.patch<Goal>(`${this.api}/${id}/progress`, request);
  }

  updateStatus(id: number, status: GoalStatus) {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Goal>(`${this.api}/${id}/status`, null, { params });
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  // ── Sub-goals ─────────────────────────────────────────────────────────────

  createSubGoal(request: SubGoalRequest) {
    return this.http.post<SubGoal>(this.subApi, request);
  }

  updateSubGoal(id: number, request: SubGoalRequest) {
    return this.http.put<SubGoal>(`${this.subApi}/${id}`, request);
  }

  updateSubGoalProgress(id: number, request: ProgressUpdateRequest) {
    return this.http.patch<SubGoal>(`${this.subApi}/${id}/progress`, request);
  }

  deleteSubGoal(id: number) {
    return this.http.delete<void>(`${this.subApi}/${id}`);
  }
}
