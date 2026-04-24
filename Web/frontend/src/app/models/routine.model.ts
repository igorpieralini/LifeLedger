export interface RoutineEvent {
  id: number;
  title: string;
  dayOfWeek: number; // 0=Sunday ... 6=Saturday
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  color: string;
}

export interface RoutineEventRequest {
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  color?: string;
}

export const DAYS_OF_WEEK = [
  { value: 0, short: 'Dom', full: 'Domingo' },
  { value: 1, short: 'Seg', full: 'Segunda' },
  { value: 2, short: 'Ter', full: 'Terça' },
  { value: 3, short: 'Qua', full: 'Quarta' },
  { value: 4, short: 'Qui', full: 'Quinta' },
  { value: 5, short: 'Sex', full: 'Sexta' },
  { value: 6, short: 'Sáb', full: 'Sábado' },
];

export const EVENT_COLORS = [
  '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
];
