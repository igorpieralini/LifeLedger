export interface FinanceRecord {
  id?: number;
  year: number;
  month: number;
  monthlyIncome: number;
  monthlyInvestment: number;
  creditCardLimit: number;
  debitCardLimit: number;
  debts: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceRecordRequest {
  year: number;
  month: number;
  monthlyIncome: number;
  monthlyInvestment: number;
  creditCardLimit: number;
  debitCardLimit: number;
  debts: number;
}

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
