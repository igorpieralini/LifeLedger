import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AtomCard } from '../../../components/atoms/atom-card/atom-card';
import { AtomIcon } from '../../../components/atoms/atom-icon/atom-icon';
import { AtomText } from '../../../components/atoms/atom-text/atom-text';
import { AtomHeading } from '../../../components/atoms/atom-heading/atom-heading';
import { AtomButton } from '../../../components/atoms/atom-button/atom-button';
import { AtomSpinner } from '../../../components/atoms/atom-spinner/atom-spinner';
import { CategoryApiService, CategoryResponse } from '../../../services/category-api.service';
import { CategoryLimitApiService, CategoryLimitResponse } from '../../../services/category-limit-api.service';

interface CategoryWithLimit {
  category: CategoryResponse;
  limit: CategoryLimitResponse | null;
  editing: boolean;
  editValue: string;
  saving: boolean;
}

@Component({
  selector: 'page-limits',
  imports: [
    CurrencyPipe, FormsModule,
    AtomCard, AtomIcon, AtomText, AtomHeading, AtomButton, AtomSpinner,
  ],
  templateUrl: './limits.html',
  styleUrl: './limits.scss',
})
export class LimitsPage implements OnInit {
  private readonly catApi = inject(CategoryApiService);
  private readonly limitApi = inject(CategoryLimitApiService);

  loading = signal(true);
  items = signal<CategoryWithLimit[]>([]);

  totalLimits = computed(() =>
    this.items().reduce((sum, it) => sum + (it.limit?.limitAmount ?? 0), 0)
  );

  configuredCount = computed(() =>
    this.items().filter(it => it.limit !== null).length
  );

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    forkJoin({
      categories: this.catApi.list(),
      limits: this.limitApi.list(),
    }).subscribe({
      next: ({ categories, limits }) => {
        const limitMap = new Map(limits.map(l => [l.categoryName, l]));
        const merged: CategoryWithLimit[] = categories.map(cat => ({
          category: cat,
          limit: limitMap.get(cat.name) ?? null,
          editing: false,
          editValue: '',
          saving: false,
        }));
        this.items.set(merged);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startEdit(item: CategoryWithLimit) {
    this.items.update(list => list.map(it => ({
      ...it,
      editing: it === item,
      editValue: it === item ? (it.limit?.limitAmount?.toString() ?? '') : it.editValue,
    })));
  }

  cancelEdit() {
    this.items.update(list => list.map(it => ({ ...it, editing: false })));
  }

  saveLimit(item: CategoryWithLimit) {
    const amount = parseFloat(item.editValue);
    if (!amount || amount <= 0) return;

    this.items.update(list => list.map(it =>
      it === item ? { ...it, saving: true } : it
    ));

    const req = { categoryName: item.category.name, limitAmount: amount };

    const obs = item.limit
      ? this.limitApi.update(item.limit.id, req)
      : this.limitApi.create(req);

    obs.subscribe({
      next: (saved) => {
        this.items.update(list => list.map(it =>
          it === item ? { ...it, limit: saved, editing: false, saving: false } : it
        ));
      },
      error: () => {
        this.items.update(list => list.map(it =>
          it === item ? { ...it, saving: false } : it
        ));
      },
    });
  }

  removeLimit(item: CategoryWithLimit) {
    if (!item.limit) return;
    const limitId = item.limit.id;

    this.items.update(list => list.map(it =>
      it === item ? { ...it, saving: true } : it
    ));

    this.limitApi.delete(limitId).subscribe({
      next: () => {
        this.items.update(list => list.map(it =>
          it === item ? { ...it, limit: null, editing: false, saving: false } : it
        ));
      },
      error: () => {
        this.items.update(list => list.map(it =>
          it === item ? { ...it, saving: false } : it
        ));
      },
    });
  }
}
