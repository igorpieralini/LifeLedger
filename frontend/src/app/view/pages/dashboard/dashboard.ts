import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AtomCard } from '../../../components/atoms/atom-card/atom-card';
import { AtomIcon } from '../../../components/atoms/atom-icon/atom-icon';
import { AtomText } from '../../../components/atoms/atom-text/atom-text';
import { AtomHeading } from '../../../components/atoms/atom-heading/atom-heading';
import { AtomSpinner } from '../../../components/atoms/atom-spinner/atom-spinner';
import { TransactionApiService } from '../../../services/transaction-api.service';
import { TransactionResponse } from '../../../services/dashboard-api.service';

@Component({
  selector: 'page-dashboard',
  imports: [
    CurrencyPipe, DecimalPipe,
    AtomCard, AtomIcon, AtomText, AtomHeading, AtomSpinner,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private readonly txApi = inject(TransactionApiService);

  loadingStats = signal(true);

  allTransactions = signal<TransactionResponse[]>([]);

  totalIncome = computed(() =>
    this.allTransactions()
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  totalExpense = computed(() =>
    this.allTransactions()
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  profit = computed(() => this.totalIncome() - this.totalExpense());

  profitPercent = computed(() => {
    const income = this.totalIncome();
    if (income === 0) return 0;
    return (this.profit() / income) * 100;
  });

  totalTransactions = computed(() => this.allTransactions().length);

  monthlyFlow = computed(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
        income: 0,
        expense: 0,
      };
    });

    const monthMap = new Map(months.map(month => [month.key, month]));

    for (const tx of this.allTransactions()) {
      const date = this.parseTxDate(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const month = monthMap.get(key);
      if (!month) continue;
      if (tx.type === 'INCOME') month.income += tx.amount;
      if (tx.type === 'EXPENSE') month.expense += tx.amount;
    }

    const maxValue = Math.max(1, ...months.map(month => Math.max(month.income, month.expense)));

    return months.map(month => ({
      ...month,
      net: month.income - month.expense,
      incomePercent: (month.income / maxValue) * 100,
      expensePercent: (month.expense / maxValue) * 100,
    }));
  });

  expenseByCategory = computed(() => {
    const expenses = this.allTransactions().filter(tx => tx.type === 'EXPENSE');
    const total = expenses.reduce((sum, tx) => sum + tx.amount, 0);
    const byCategory = new Map<string, { label: string; color: string; amount: number }>();

    for (const tx of expenses) {
      const label = tx.categoryName ?? 'Sem categoria';
      const color = tx.categoryColor ?? 'var(--color-primary)';
      const current = byCategory.get(label);
      if (current) {
        current.amount += tx.amount;
      } else {
        byCategory.set(label, { label, color, amount: tx.amount });
      }
    }

    return Array.from(byCategory.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
      .map(category => ({
        ...category,
        percent: total > 0 ? (category.amount / total) * 100 : 0,
      }));
  });

  incomeCount = computed(() => this.allTransactions().filter(tx => tx.type === 'INCOME').length);
  expenseCount = computed(() => this.allTransactions().filter(tx => tx.type === 'EXPENSE').length);

  incomeShare = computed(() => {
    const total = this.totalIncome() + this.totalExpense();
    if (total === 0) return 0;
    return (this.totalIncome() / total) * 100;
  });

  dailyFlow = computed(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
      return {
        key: this.formatDateKey(date),
        label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        income: 0,
        expense: 0,
      };
    });

    const dayMap = new Map(days.map(day => [day.key, day]));

    for (const tx of this.allTransactions()) {
      const key = this.dateKeyFromIso(tx.date);
      const day = dayMap.get(key);
      if (!day) continue;
      if (tx.type === 'INCOME') day.income += tx.amount;
      if (tx.type === 'EXPENSE') day.expense += tx.amount;
    }

    const maxValue = Math.max(1, ...days.map(day => Math.max(day.income, day.expense)));

    return days.map(day => ({
      ...day,
      incomePercent: (day.income / maxValue) * 100,
      expensePercent: (day.expense / maxValue) * 100,
      balance: day.income - day.expense,
    }));
  });

  ngOnInit() {
    this.txApi.history().subscribe({
      next: (data) => { this.allTransactions.set(data); this.loadingStats.set(false); },
      error: () => this.loadingStats.set(false),
    });
  }

  private parseTxDate(dateIso: string): Date {
    const [year, month, day] = dateIso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private dateKeyFromIso(dateIso: string): string {
    const date = this.parseTxDate(dateIso);
    return this.formatDateKey(date);
  }

  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
