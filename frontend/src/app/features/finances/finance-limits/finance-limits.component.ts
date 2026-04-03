import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SelectNativeComponent, InputNumberInlineComponent } from '../../../shared/components/atoms';
import { debounceTime } from 'rxjs';
import { FinanceService } from '../../../core/services/finance.service';
import { CategoryLimitStatus } from '../../../core/models/finance.model';

type Row = CategoryLimitStatus & { period: string };

@Component({
  selector: 'll-finance-limits',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatIconModule,
    MatButtonModule,
    SelectNativeComponent,
    InputNumberInlineComponent
  ],
  templateUrl: './finance-limits.component.html',
  styleUrl: './finance-limits.component.scss'
})
export class FinanceLimitsComponent implements OnInit {
  loading = signal(false);
  rows = signal<Row[]>([]);
  editableLimitByCategory = signal<Record<string, number>>({});
  limitIdByCategory = signal<Record<string, number>>({});
  savingCategory = signal<string | null>(null);
  saveError = signal('');

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  years = Array.from({ length: 5 }, (_, i) => this.currentYear - 2 + i);
  months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Fev' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Abr' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Ago' },
    { value: 9, label: 'Set' },
    { value: 10, label: 'Out' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dez' }
  ];

  form = this.fb.group({
    year: [this.currentYear],
    month: [this.currentMonth],
    category: ['ALL']
  });

  filteredRows = computed(() => {
    const selectedCategory = this.form.value.category ?? 'ALL';
    const all = this.rows();
    if (selectedCategory === 'ALL') return all;
    return all.filter(r => r.categoryName === selectedCategory);
  });

  exceededRows = computed(() => this.filteredRows().filter(r => r.exceeded));

  categories = computed(() => {
    const set = new Set(this.rows().map(r => r.categoryName));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  constructor(private fb: FormBuilder, private financeService: FinanceService) {}

  ngOnInit(): void {
    this.load();
    this.loadCategoryLimits();
    this.form.valueChanges
      .pipe(debounceTime(120))
      .subscribe(() => this.load());
  }

  limitValue(categoryName: string, fallback: number): number {
    const fromEditor = this.editableLimitByCategory()[categoryName];
    return fromEditor ?? fallback;
  }

  onLimitInput(categoryName: string, value: string) {
    const parsed = Number(String(value).replace(',', '.'));
    this.editableLimitByCategory.update(current => ({
      ...current,
      [categoryName]: Number.isFinite(parsed) ? parsed : 0
    }));
  }

  saveLimit(categoryName: string) {
    const id = this.limitIdByCategory()[categoryName];
    const amount = this.editableLimitByCategory()[categoryName];

    if (!id || amount == null || Number.isNaN(amount) || amount < 0) {
      this.saveError.set('Informe um limite valido antes de salvar.');
      return;
    }

    this.savingCategory.set(categoryName);
    this.saveError.set('');

    this.financeService.updateCategoryLimit(id, {
      categoryName,
      limitAmount: amount
    }).subscribe({
      next: () => {
        this.savingCategory.set(null);
        this.load();
        this.loadCategoryLimits();
      },
      error: () => {
        this.savingCategory.set(null);
        this.saveError.set('Nao foi possivel salvar o limite.');
      }
    });
  }

  load() {
    const year = this.form.value.year ?? this.currentYear;
    const month = this.form.value.month ?? this.currentMonth;

    this.loading.set(true);

    this.financeService.getLimits(year, month).subscribe({
      next: (response) => {
        const mapped = response.categories.map(c => ({
          ...c,
          period: `${String(response.month).padStart(2, '0')}/${response.year}`
        }));
        this.rows.set(mapped);
        this.loading.set(false);
      },
      error: () => {
        this.rows.set([]);
        this.loading.set(false);
      }
    });
  }

  private loadCategoryLimits() {
    this.financeService.getCategoryLimits().subscribe({
      next: (limits) => {
        const ids: Record<string, number> = {};
        const values: Record<string, number> = {};

        for (const limit of limits) {
          ids[limit.categoryName] = limit.id;
          values[limit.categoryName] = limit.limitAmount;
        }

        this.limitIdByCategory.set(ids);
        this.editableLimitByCategory.set(values);
      },
      error: () => {
        this.limitIdByCategory.set({});
      }
    });
  }
}
