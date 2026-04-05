import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SubGoalResponse } from './dashboard-api.service';

export interface SubGoalRequest {
  goalId: number;
  title: string;
  description?: string;
  period: 'ANNUAL' | 'MONTHLY' | 'WEEKLY';
  referenceDate: string;
  targetValue?: number;
}

export interface ProgressUpdateRequest {
  currentValue: number;
}

@Injectable({ providedIn: 'root' })
export class SubGoalApiService {
  constructor(private api: ApiService) {}

  create(data: SubGoalRequest): Observable<SubGoalResponse> {
    return this.api.post<SubGoalResponse>('/sub-goals', data);
  }

  listByGoal(goalId: number): Observable<SubGoalResponse[]> {
    return this.api.get<SubGoalResponse[]>(`/sub-goals/goal/${goalId}`);
  }

  update(id: number, data: SubGoalRequest): Observable<SubGoalResponse> {
    return this.api.put<SubGoalResponse>(`/sub-goals/${id}`, data);
  }

  updateProgress(id: number, data: ProgressUpdateRequest): Observable<SubGoalResponse> {
    return this.api.patch<SubGoalResponse>(`/sub-goals/${id}/progress`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/sub-goals/${id}`);
  }
}
