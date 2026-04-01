export type TransactionType = 'INCOME' | 'EXPENSE';
export type CategoryType = 'FIXED' | 'VARIABLE';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  notes?: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  createdAt: string;
}

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  categoryId?: number;
  notes?: string;
}

export interface CategoryRequest {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

export interface CategoryBreakdown {
  categoryName: string;
  categoryColor?: string;
  total: number;
  percentage: number;
}

export interface FinanceSummary {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expensesByCategory: CategoryBreakdown[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── CSV Import ────────────────────────────────────────────────────────────────

export interface CsvImportResult {
  totalRows:    number;
  imported:     number;
  duplicates:   number;   // já existiam no banco — ignorados
  skipped:      number;
  totalIncome:  number;
  totalExpense: number;
  balance:      number;
  byCategory:   Record<string, number>;
  transactions: CsvImportedRow[];
  skippedRows:  CsvSkippedRow[];
}

export interface CsvImportedRow {
  description: string;
  date:        string;
  amount:      number;
  type:        TransactionType;
  category:    string;
}

export interface CsvSkippedRow {
  line:   number;
  raw:    string;
  reason: string;
}
