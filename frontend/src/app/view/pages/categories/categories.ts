import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { AtomCard } from '../../../components/atoms/atom-card/atom-card';
import { AtomIcon } from '../../../components/atoms/atom-icon/atom-icon';
import { AtomText } from '../../../components/atoms/atom-text/atom-text';
import { AtomHeading } from '../../../components/atoms/atom-heading/atom-heading';
import { AtomBadge } from '../../../components/atoms/atom-badge/atom-badge';
import { AtomButton } from '../../../components/atoms/atom-button/atom-button';
import { AtomInput } from '../../../components/atoms/atom-input/atom-input';
import { AtomSelect, SelectOption } from '../../../components/atoms/atom-select/atom-select';
import { AtomSpinner } from '../../../components/atoms/atom-spinner/atom-spinner';
import { AtomFeedbackState } from '../../../components/atoms/atom-feedback-state/atom-feedback-state';
import { AtomCategoryTile } from '../../../components/atoms/atom-category-tile/atom-category-tile';
import { SharedPopup } from '../../../components/shared/shared-popup/shared-popup';
import { CategoryApiService, CategoryResponse, CategoryRequest } from '../../../services/category-api.service';

const PRESET_COLORS = [
  '#10b981', '#0d9488', '#059669', '#22c55e',
  '#6366f1', '#818cf8', '#4f46e5', '#a855f7', '#9333ea',
  '#f59e0b', '#d97706', '#f97316',
  '#ef4444', '#f43f5e', '#fb7185', '#ec4899', '#f472b6',
  '#6b7280', '#94a3b8',
];

const PRESET_ICONS = [
  'category', 'receipt_long', 'shopping_cart', 'restaurant', 'directions_car',
  'local_gas_station', 'movie', 'school', 'favorite', 'home',
  'exercise', 'savings', 'payments', 'attach_money', 'commute',
];

@Component({
  selector: 'page-categories',
  imports: [
    AtomCard, AtomIcon, AtomText, AtomHeading, AtomBadge,
    AtomButton, AtomInput, AtomSelect, AtomSpinner,
    AtomFeedbackState, AtomCategoryTile, SharedPopup,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {
  private readonly catApi = inject(CategoryApiService);

  loading = signal(true);
  categories = signal<CategoryResponse[]>([]);
  deleting = signal<number | null>(null);
  creating = signal(false);
  showForm = signal(false);
  searchTerm = signal('');

  // Form fields
  newName = signal('');
  newType = signal('VARIABLE');
  newColor = signal('#6366f1');
  newIcon = signal('category');

  presetColors = PRESET_COLORS;
  presetIcons = PRESET_ICONS;

  typeOptions: SelectOption[] = [
    { value: 'VARIABLE', label: 'Variável' },
    { value: 'FIXED', label: 'Fixa' },
  ];

  sortedCategories = computed(() => [...this.categories()].sort((left, right) => left.name.localeCompare(right.name, 'pt-BR')));
  filteredCategories = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase();
    if (!term) return this.sortedCategories();

    return this.sortedCategories().filter(category => {
      const typeLabel = category.type === 'FIXED' ? 'fixa' : 'variavel';
      return category.name.toLocaleLowerCase().includes(term)
        || (category.icon ?? '').toLocaleLowerCase().includes(term)
        || typeLabel.includes(term);
    });
  });
  fixedCategories = computed(() => this.filteredCategories().filter(c => c.type === 'FIXED'));
  variableCategories = computed(() => this.filteredCategories().filter(c => c.type === 'VARIABLE'));
  totalCategories = computed(() => this.categories().length);
  totalFixed = computed(() => this.categories().filter(c => c.type === 'FIXED').length);
  totalVariable = computed(() => this.categories().filter(c => c.type === 'VARIABLE').length);
  accentPaletteSize = computed(() => new Set(this.categories().map(category => category.color ?? 'none')).size);
  visibleCount = computed(() => this.filteredCategories().length);
  hasActiveSearch = computed(() => this.searchTerm().trim().length > 0);
  previewTypeLabel = computed(() => this.newType() === 'FIXED' ? 'Fixa' : 'Variável');

  canCreate = computed(() => this.newName().trim().length > 0);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.catApi.list().subscribe({
      next: cats => { this.categories.set(cats); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.resetForm();
  }

  resetForm() {
    this.newName.set('');
    this.newType.set('VARIABLE');
    this.newColor.set('#6366f1');
    this.newIcon.set('category');
  }

  selectColor(color: string) {
    this.newColor.set(color);
  }

  selectIcon(icon: string) {
    this.newIcon.set(icon);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

  shareOfTotal(count: number): number {
    const total = this.totalCategories();
    return total === 0 ? 0 : Math.round((count / total) * 100);
  }

  createCategory() {
    if (!this.canCreate() || this.creating()) return;
    this.creating.set(true);
    const req: CategoryRequest = {
      name: this.newName().trim(),
      type: this.newType() as 'FIXED' | 'VARIABLE',
      color: this.newColor(),
      icon: this.newIcon() || 'category',
    };
    this.catApi.create(req).subscribe({
      next: () => {
        this.creating.set(false);
        this.showForm.set(false);
        this.resetForm();
        this.loadCategories();
      },
      error: () => this.creating.set(false),
    });
  }

  deleteCategory(cat: { id: number }) {
    if (this.deleting() !== null) return;
    this.deleting.set(cat.id);
    this.catApi.delete(cat.id).subscribe({
      next: () => {
        this.categories.update(list => list.filter(c => c.id !== cat.id));
        this.deleting.set(null);
      },
      error: () => this.deleting.set(null),
    });
  }
}
