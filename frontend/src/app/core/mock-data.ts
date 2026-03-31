import { Dashboard } from './models/dashboard.model';
import { Goal } from './models/goal.model';
import { Category, FinanceSummary, Page, Transaction } from './models/finance.model';

export const MOCK_GOALS: Goal[] = [
  {
    id: 1,
    title: 'Viagem para Europa',
    description: 'Férias de 15 dias visitando Portugal, Espanha e França',
    year: 2026,
    targetValue: 25000,
    currentValue: 16250,
    progress: 65,
    status: 'IN_PROGRESS',
    deadline: '2026-12-01',
    subGoals: [],
    createdAt: '2026-01-05T10:00:00',
    updatedAt: '2026-03-15T14:30:00',
  },
  {
    id: 2,
    title: 'Reserva de emergência',
    description: '6 meses de despesas guardados',
    year: 2026,
    targetValue: 30000,
    currentValue: 24000,
    progress: 80,
    status: 'IN_PROGRESS',
    deadline: '2026-06-30',
    subGoals: [],
    createdAt: '2026-01-02T09:00:00',
    updatedAt: '2026-03-10T11:00:00',
  },
  {
    id: 3,
    title: 'Novo notebook',
    description: 'MacBook Pro para trabalho e projetos pessoais',
    year: 2025,
    targetValue: 12000,
    currentValue: 12000,
    progress: 100,
    status: 'COMPLETED',
    deadline: '2025-11-30',
    subGoals: [],
    createdAt: '2025-06-01T08:00:00',
    updatedAt: '2025-11-20T16:00:00',
  },
  {
    id: 4,
    title: 'Curso de inglês avançado',
    description: 'Atingir nível C1 até o final do ano',
    year: 2026,
    targetValue: 3600,
    currentValue: 1620,
    progress: 45,
    status: 'IN_PROGRESS',
    deadline: '2026-11-30',
    subGoals: [],
    createdAt: '2026-02-01T10:00:00',
    updatedAt: '2026-03-20T09:00:00',
  },
  {
    id: 5,
    title: 'Academia — plano anual',
    description: 'Manter regularidade de 4x por semana',
    year: 2026,
    targetValue: 2400,
    currentValue: 480,
    progress: 20,
    status: 'DELAYED',
    deadline: '2026-12-31',
    subGoals: [],
    createdAt: '2026-01-10T07:00:00',
    updatedAt: '2026-02-28T07:00:00',
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Alimentação',   type: 'VARIABLE', color: '#F97316', icon: 'restaurant',    createdAt: '2026-01-01T00:00:00' },
  { id: 2, name: 'Transporte',    type: 'VARIABLE', color: '#3B82F6', icon: 'directions_car', createdAt: '2026-01-01T00:00:00' },
  { id: 3, name: 'Lazer',         type: 'VARIABLE', color: '#8B5CF6', icon: 'sports_esports', createdAt: '2026-01-01T00:00:00' },
  { id: 4, name: 'Saúde',         type: 'FIXED',    color: '#10B981', icon: 'local_hospital', createdAt: '2026-01-01T00:00:00' },
  { id: 5, name: 'Educação',      type: 'FIXED',    color: '#06B6D4', icon: 'school',         createdAt: '2026-01-01T00:00:00' },
  { id: 6, name: 'Moradia',       type: 'FIXED',    color: '#EF4444', icon: 'home',           createdAt: '2026-01-01T00:00:00' },
  { id: 7, name: 'Salário',       type: 'FIXED',    color: '#22C55E', icon: 'payments',       createdAt: '2026-01-01T00:00:00' },
  { id: 8, name: 'Freelance',     type: 'VARIABLE', color: '#84CC16', icon: 'work',           createdAt: '2026-01-01T00:00:00' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1,  type: 'INCOME',  amount: 7500,   description: 'Salário março',          date: '2026-03-05', categoryId: 7, categoryName: 'Salário',     categoryColor: '#22C55E', createdAt: '2026-03-05T09:00:00' },
  { id: 2,  type: 'INCOME',  amount: 1200,   description: 'Projeto freelance',       date: '2026-03-12', categoryId: 8, categoryName: 'Freelance',    categoryColor: '#84CC16', createdAt: '2026-03-12T14:00:00' },
  { id: 3,  type: 'EXPENSE', amount: 1800,   description: 'Aluguel',                 date: '2026-03-10', categoryId: 6, categoryName: 'Moradia',      categoryColor: '#EF4444', createdAt: '2026-03-10T08:00:00' },
  { id: 4,  type: 'EXPENSE', amount: 650,    description: 'Supermercado Extra',      date: '2026-03-08', categoryId: 1, categoryName: 'Alimentação',  categoryColor: '#F97316', createdAt: '2026-03-08T19:00:00' },
  { id: 5,  type: 'EXPENSE', amount: 280,    description: 'Posto de gasolina',       date: '2026-03-11', categoryId: 2, categoryName: 'Transporte',   categoryColor: '#3B82F6', createdAt: '2026-03-11T07:30:00' },
  { id: 6,  type: 'EXPENSE', amount: 320,    description: 'Escola de inglês',        date: '2026-03-03', categoryId: 5, categoryName: 'Educação',     categoryColor: '#06B6D4', createdAt: '2026-03-03T10:00:00' },
  { id: 7,  type: 'EXPENSE', amount: 150,    description: 'Plano de saúde',          date: '2026-03-01', categoryId: 4, categoryName: 'Saúde',        categoryColor: '#10B981', createdAt: '2026-03-01T08:00:00' },
  { id: 8,  type: 'EXPENSE', amount: 200,    description: 'Cinema e jantar',         date: '2026-03-15', categoryId: 3, categoryName: 'Lazer',        categoryColor: '#8B5CF6', createdAt: '2026-03-15T21:00:00' },
  { id: 9,  type: 'EXPENSE', amount: 480,    description: 'Supermercado Pão de Açúcar', date: '2026-03-20', categoryId: 1, categoryName: 'Alimentação', categoryColor: '#F97316', createdAt: '2026-03-20T18:00:00' },
  { id: 10, type: 'EXPENSE', amount: 120,    description: 'Uber — semana',           date: '2026-03-18', categoryId: 2, categoryName: 'Transporte',   categoryColor: '#3B82F6', createdAt: '2026-03-18T22:00:00' },
];

export const MOCK_DASHBOARD: Dashboard = {
  currentMonthIncome:   8700,
  currentMonthExpense:  4000,
  currentMonthBalance:  4700,
  totalBalance:         18250,
  totalGoals:           5,
  completedGoals:       1,
  delayedGoals:         1,
  averageGoalProgress:  62,
  recentTransactions:   MOCK_TRANSACTIONS.slice(0, 5),
  activeGoals:          MOCK_GOALS.filter(g => g.status === 'IN_PROGRESS' || g.status === 'DELAYED'),
};

export const MOCK_TRANSACTIONS_PAGE: Page<Transaction> = {
  content:       MOCK_TRANSACTIONS,
  totalElements: MOCK_TRANSACTIONS.length,
  totalPages:    1,
  number:        0,
  size:          20,
};

export const MOCK_FINANCE_SUMMARY: FinanceSummary = {
  year:         2026,
  month:        3,
  totalIncome:  8700,
  totalExpense: 4000,
  balance:      4700,
  expensesByCategory: [
    { categoryName: 'Moradia',     categoryColor: '#EF4444', total: 1800, percentage: 45.0 },
    { categoryName: 'Alimentação', categoryColor: '#F97316', total: 1130, percentage: 28.3 },
    { categoryName: 'Transporte',  categoryColor: '#3B82F6', total: 400,  percentage: 10.0 },
    { categoryName: 'Educação',    categoryColor: '#06B6D4', total: 320,  percentage: 8.0  },
    { categoryName: 'Lazer',       categoryColor: '#8B5CF6', total: 200,  percentage: 5.0  },
    { categoryName: 'Saúde',       categoryColor: '#10B981', total: 150,  percentage: 3.7  },
  ],
};
