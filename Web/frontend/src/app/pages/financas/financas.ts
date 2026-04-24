import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinanceRecord, MONTH_NAMES } from '../../models/finance.model';
import { FinanceService } from '../../services/finance.service';
import { IconBtnComponent } from '../../components/atoms/icon-btn/icon-btn';

type FieldKey = 'monthlyIncome' | 'monthlyInvestment' | 'creditCardLimit' | 'debitCardLimit' | 'debts';

@Component({
  selector: 'page-financas',
  imports: [FormsModule, IconBtnComponent],
  templateUrl: './financas.html',
  styleUrl: './financas.scss',
})
export class FinancasPage implements OnInit {
  private readonly financeService = inject(FinanceService);

  // Current month selection
  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth() + 1);

  monthLabel = computed(() => {
    return `${MONTH_NAMES[this.selectedMonth() - 1]} ${this.selectedYear()}`;
  });

  // Data
  record = signal<FinanceRecord>(this.emptyRecord());

  loading = signal(false);
  dirty = signal(false);

  // Investment history
  investmentHistory = signal<{ label: string; value: number }[]>([]);
  totalInvested = computed(() =>
    this.investmentHistory().reduce((sum, m) => sum + m.value, 0)
  );

  // Edit modal
  editing = signal<FieldKey | null>(null);
  editValue = 0;

  // Computed values
  available = computed(() => {
    const r = this.record();
    return r.monthlyIncome - r.monthlyInvestment - r.creditCardLimit - r.debitCardLimit - r.debts;
  });

  investmentPct = computed(() => {
    const r = this.record();
    return r.monthlyIncome > 0 ? Math.round((r.monthlyInvestment / r.monthlyIncome) * 100) : 0;
  });

  creditPct = computed(() => {
    const r = this.record();
    return r.monthlyIncome > 0 ? Math.round((r.creditCardLimit / r.monthlyIncome) * 100) : 0;
  });

  debitPct = computed(() => {
    const r = this.record();
    return r.monthlyIncome > 0 ? Math.round((r.debitCardLimit / r.monthlyIncome) * 100) : 0;
  });

  debtsPct = computed(() => {
    const r = this.record();
    return r.monthlyIncome > 0 ? Math.round((r.debts / r.monthlyIncome) * 100) : 0;
  });

  availablePct = computed(() => {
    const r = this.record();
    return r.monthlyIncome > 0 ? Math.round((Math.max(this.available(), 0) / r.monthlyIncome) * 100) : 0;
  });

  isOver = computed(() => this.available() < 0);

  readonly fields: { key: FieldKey; label: string; icon: string; color: string }[] = [
    { key: 'monthlyIncome',     label: 'Renda mensal',          icon: 'payments',        color: '#10b981' },
    { key: 'monthlyInvestment', label: 'Investimento mensal',   icon: 'trending_up',     color: '#3b82f6' },
    { key: 'creditCardLimit',   label: 'Limite cartão crédito', icon: 'credit_card',     color: '#f59e0b' },
    { key: 'debitCardLimit',    label: 'Limite cartão débito',  icon: 'account_balance', color: '#8b5cf6' },
    { key: 'debts',             label: 'Dívidas',               icon: 'money_off',       color: '#ef4444' },
  ];

  ngOnInit() {
    this.loadMonth();
    this.loadHistory();
  }

  prevMonth() {
    let y = this.selectedYear();
    let m = this.selectedMonth() - 1;
    if (m < 1) { m = 12; y--; }
    this.selectedYear.set(y);
    this.selectedMonth.set(m);
    this.loadMonth();
  }

  nextMonth() {
    let y = this.selectedYear();
    let m = this.selectedMonth() + 1;
    if (m > 12) { m = 1; y++; }
    this.selectedYear.set(y);
    this.selectedMonth.set(m);
    this.loadMonth();
  }

  loadMonth() {
    this.loading.set(true);
    this.dirty.set(false);
    this.financeService.getByMonth(this.selectedYear(), this.selectedMonth()).subscribe({
      next: (resp) => {
        this.record.set(resp.status === 200 && resp.body ? resp.body : this.emptyRecord());
        this.loading.set(false);
      },
      error: () => {
        this.record.set(this.emptyRecord());
        this.loading.set(false);
      },
    });
  }

  loadHistory() {
    this.financeService.listAll().subscribe({
      next: (records) => {
        this.investmentHistory.set(
          records
            .filter(r => r.monthlyInvestment > 0)
            .map(r => ({
              label: `${MONTH_NAMES[r.month - 1].substring(0, 3)} ${r.year}`,
              value: r.monthlyInvestment,
            }))
        );
      },
    });
  }

  startEdit(key: FieldKey) {
    this.editing.set(key);
    this.editValue = this.record()[key];
  }

  saveEdit() {
    const key = this.editing();
    if (!key) return;
    const value = Math.max(0, this.editValue);
    this.record.update(r => ({ ...r, [key]: value }));
    this.editing.set(null);
    this.persist();
  }

  cancelEdit() {
    this.editing.set(null);
  }

  private persist() {
    const r = this.record();
    this.financeService.save({
      year: this.selectedYear(),
      month: this.selectedMonth(),
      monthlyIncome: r.monthlyIncome,
      monthlyInvestment: r.monthlyInvestment,
      creditCardLimit: r.creditCardLimit,
      debitCardLimit: r.debitCardLimit,
      debts: r.debts,
    }).subscribe({
      next: (saved) => {
        this.record.set(saved);
        this.dirty.set(false);
        this.loadHistory();
      },
    });
  }

  fieldPct(key: FieldKey): number {
    if (key === 'monthlyIncome') return 0;
    if (key === 'monthlyInvestment') return this.investmentPct();
    if (key === 'creditCardLimit') return this.creditPct();
    if (key === 'debitCardLimit') return this.debitPct();
    return this.debtsPct();
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private emptyRecord(): FinanceRecord {
    return {
      year: this.selectedYear(),
      month: this.selectedMonth(),
      monthlyIncome: 0,
      monthlyInvestment: 0,
      creditCardLimit: 0,
      debitCardLimit: 0,
      debts: 0,
    };
  }
}
