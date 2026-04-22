import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DashboardResponse {
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthBalance: number;
  totalBalance: number;
  totalGoals: number;
  completedGoals: number;
  delayedGoals: number;
  averageGoalProgress: number;
  recentTransactions: TransactionResponse[];
  activeGoals: GoalResponse[];
}

export interface TransactionResponse {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  notes: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  createdAt: string;
}

export interface GoalResponse {
  id: number;
  title: string;
  description: string;
  year: number;
  financial: boolean;
  category: 'CAREER' | 'FINANCE' | 'STUDIES' | 'GROWTH';
  icon: string | null;
  color: string | null;
  targetValue: number;
  currentValue: number;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  deadline: string | null;
  subGoals: SubGoalResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SubGoalResponse {
  id: number;
  goalId: number;
  title: string;
  description: string;
  period: 'ANNUAL' | 'MONTHLY' | 'WEEKLY';
  referenceDate: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  constructor(private api: ApiService) {}

  get(): Observable<DashboardResponse> {
    return this.api.get<DashboardResponse>('/dashboard');
  }
}
