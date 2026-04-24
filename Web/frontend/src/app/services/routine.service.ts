import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoutineEvent, RoutineEventRequest } from '../models/routine.model';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8080/api/routine-events';

  list() {
    return this.http.get<RoutineEvent[]>(this.base);
  }

  create(request: RoutineEventRequest) {
    return this.http.post<RoutineEvent>(this.base, request);
  }

  update(id: number, request: RoutineEventRequest) {
    return this.http.put<RoutineEvent>(`${this.base}/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
