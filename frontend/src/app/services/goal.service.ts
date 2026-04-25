import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Goal, GoalCategory, GoalRequest, GoalStatus, SubTask, SubTaskRequest } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/goals';

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

  // SubTasks
  listSubTasks(goalId: number) {
    return this.http.get<SubTask[]>(`${this.base}/${goalId}/subtasks`);
  }

  createSubTask(goalId: number, request: SubTaskRequest) {
    return this.http.post<SubTask>(`${this.base}/${goalId}/subtasks`, request);
  }

  toggleSubTask(goalId: number, subTaskId: number) {
    return this.http.patch<SubTask>(`${this.base}/${goalId}/subtasks/${subTaskId}/toggle`, {});
  }

  deleteSubTask(goalId: number, subTaskId: number) {
    return this.http.delete<void>(`${this.base}/${goalId}/subtasks/${subTaskId}`);
  }

  replaceSubTasks(goalId: number, requests: SubTaskRequest[]) {
    return this.http.put<SubTask[]>(`${this.base}/${goalId}/subtasks`, requests);
  }
}
