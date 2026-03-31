export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
export type GoalPeriod = 'ANNUAL' | 'MONTHLY' | 'WEEKLY';

export interface Goal {
  id: number;
  title: string;
  description?: string;
  year: number;
  targetValue?: number;
  currentValue: number;
  progress: number;
  status: GoalStatus;
  deadline?: string;
  subGoals: SubGoal[];
  createdAt: string;
  updatedAt: string;
}

export interface SubGoal {
  id: number;
  goalId: number;
  title: string;
  description?: string;
  period: GoalPeriod;
  referenceDate: string;
  targetValue?: number;
  currentValue: number;
  progress: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GoalRequest {
  title: string;
  description?: string;
  year: number;
  targetValue?: number;
  deadline?: string;
}

export interface SubGoalRequest {
  goalId: number;
  title: string;
  description?: string;
  period: GoalPeriod;
  referenceDate: string;
  targetValue?: number;
}

export interface ProgressUpdateRequest {
  currentValue: number;
}
