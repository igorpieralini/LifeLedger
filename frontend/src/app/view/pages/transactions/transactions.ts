import { Component, inject, OnInit, OnDestroy, signal, computed, effect, untracked } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtomIcon } from '../../../components/atoms/atom-icon/atom-icon';
import { AtomText } from '../../../components/atoms/atom-text/atom-text';
import { AtomBadge } from '../../../components/atoms/atom-badge/atom-badge';
import { AtomSpinner } from '../../../components/atoms/atom-spinner/atom-spinner';
import { AtomButton } from '../../../components/atoms/atom-button/atom-button';
import { AtomSelect, SelectOption } from '../../../components/atoms/atom-select/atom-select';
import { AtomInput } from '../../../components/atoms/atom-input/atom-input';
import { AtomDateRange } from '../../../components/atoms/atom-date-range/atom-date-range';
import { AtomPagination } from '../../../components/atoms/atom-pagination/atom-pagination';
import { TransactionApiService, TransactionFilter, Page } from '../../../services/transaction-api.service';
import { TransactionResponse } from '../../../services/dashboard-api.service';
import { CategoryApiService, CategoryResponse } from '../../../services/category-api.service';

@Component({
  selector: 'page-transactions',
  imports: [
    CurrencyPipe, DatePipe, FormsModule,
    AtomIcon, AtomText, AtomBadge,
    AtomSpinner, AtomButton, AtomSelect, AtomInput, AtomDateRange,
    AtomPagination,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsPage implements OnInit, OnDestroy {
  private readonly txApi = inject(TransactionApiService);
  private readonly catApi = inject(CategoryApiService);
  private filterTimer: ReturnType<typeof setTimeout> | null = null;

  loading = signal(true);
  categories = signal<CategoryResponse[]>([]);
  txPage = signal<Page<TransactionResponse> | null>(null);

  // Filters
  filterType = signal('');
  filterCategory = signal('');
  filterDateFrom = signal('');
  filterDateTo = signal('');
  filterMinAmount = signal('');
  filterMaxAmount = signal('');

  // Pagination
  currentPage = signal(0);
  readonly pageSize = 20;

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

  typeOptions: SelectOption[] = [
    { value: '', label: 'Todos' },
    { value: 'INCOME', label: 'Entrada' },
    { value: 'EXPENSE', label: 'Saída' },
  ];

  categoryOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'Todas' },
    ...this.categories().map(c => ({ value: String(c.id), label: c.name })),
  ]);

  hasActiveFilters = computed(() =>
    !!(this.filterType() || this.filterCategory() || this.filterDateFrom()
      || this.filterDateTo() || this.filterMinAmount() || this.filterMaxAmount())
  );

  // Auto-apply filters with debounce when any filter signal changes
  private readonly filterEffect = effect(() => {
    // Register all filter signals as dependencies
    this.filterType();
    this.filterCategory();
    this.filterDateFrom();
    this.filterDateTo();
    this.filterMinAmount();
    this.filterMaxAmount();
    // Debounce the API call
    untracked(() => {
      if (this.filterTimer) clearTimeout(this.filterTimer);
      this.filterTimer = setTimeout(() => this.loadTransactions(0), 250);
    });
  });

  ngOnInit() {
    this.catApi.list().subscribe({
      next: cats => this.categories.set(cats),
    });
  }

  ngOnDestroy() {
    if (this.filterTimer) clearTimeout(this.filterTimer);
  }

  clearFilters() {
    this.filterType.set('');
    this.filterCategory.set('');
    this.filterDateFrom.set('');
    this.filterDateTo.set('');
    this.filterMinAmount.set('');
    this.filterMaxAmount.set('');
  }

  loadTransactions(page: number) {
    this.loading.set(true);
    const filters: TransactionFilter = {};
    const type = this.filterType();
    if (type === 'INCOME' || type === 'EXPENSE') filters.type = type;
    const catId = this.filterCategory();
    if (catId) filters.categoryId = Number(catId);
    if (this.filterDateFrom()) filters.dateFrom = this.filterDateFrom();
    if (this.filterDateTo()) filters.dateTo = this.filterDateTo();
    if (this.filterMinAmount()) filters.minAmount = Number(this.filterMinAmount());
    if (this.filterMaxAmount()) filters.maxAmount = Number(this.filterMaxAmount());

    this.txApi.list(page, this.pageSize, filters).subscribe({
      next: data => {
        this.txPage.set(data);
        this.currentPage.set(data.number);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
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
