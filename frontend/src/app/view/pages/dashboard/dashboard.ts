import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { AtomCard } from '../../../components/atoms/atom-card/atom-card';
import { AtomIcon } from '../../../components/atoms/atom-icon/atom-icon';
import { AtomText } from '../../../components/atoms/atom-text/atom-text';
import { AtomHeading } from '../../../components/atoms/atom-heading/atom-heading';
import { AtomBadge } from '../../../components/atoms/atom-badge/atom-badge';
import { AtomSpinner } from '../../../components/atoms/atom-spinner/atom-spinner';
import { AtomTable } from '../../../components/atoms/atom-table/atom-table';
import { AtomPagination } from '../../../components/atoms/atom-pagination/atom-pagination';
import { TransactionApiService, Page } from '../../../services/transaction-api.service';
import { TransactionResponse } from '../../../services/dashboard-api.service';

@Component({
  selector: 'page-dashboard',
  imports: [
    CurrencyPipe, DatePipe, DecimalPipe,
    AtomCard, AtomIcon, AtomText, AtomHeading, AtomBadge, AtomSpinner,
    AtomTable, AtomPagination,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private readonly txApi = inject(TransactionApiService);

  loadingStats = signal(true);
  loadingTx = signal(true);

  allTransactions = signal<TransactionResponse[]>([]);
  txPage = signal<Page<TransactionResponse> | null>(null);

  // Server-side pagination
  currentPage = signal(0);
  readonly pageSize = 11;

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

  transactions = computed(() => this.txPage()?.content ?? []);
  totalElements = computed(() => this.txPage()?.totalElements ?? 0);
  totalPages = computed(() => this.txPage()?.totalPages ?? 0);

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i);
    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible;
    if (end > total) { end = total; start = end - maxVisible; }
    return Array.from({ length: end - start }, (_, i) => start + i);
  });

  ngOnInit() {
    // Load all transactions for stat totals
    this.txApi.history().subscribe({
      next: (data) => { this.allTransactions.set(data); this.loadingStats.set(false); },
      error: () => this.loadingStats.set(false),
    });

    // Load paginated transactions for table
    this.loadTransactions(0);
  }

  loadTransactions(page: number) {
    this.loadingTx.set(true);
    this.txApi.list(page, this.pageSize).subscribe({
      next: (data) => {
        this.txPage.set(data);
        this.currentPage.set(data.number);
        this.loadingTx.set(false);
      },
      error: () => this.loadingTx.set(false),
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.loadTransactions(page);
    }
  }

  prevPage() { this.goToPage(this.currentPage() - 1); }
  nextPage() { this.goToPage(this.currentPage() + 1); }
}
