import { Goal } from './goal.model';
import { Transaction } from './finance.model';

export interface Dashboard {
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthBalance: number;
  totalBalance: number;
  totalGoals: number;
  completedGoals: number;
  delayedGoals: number;
  averageGoalProgress: number;
  recentTransactions: Transaction[];
  activeGoals: Goal[];
}
