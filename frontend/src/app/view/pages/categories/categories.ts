import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AtomCard } from '../../../components/atoms/atom-card/atom-card';
import { AtomIcon } from '../../../components/atoms/atom-icon/atom-icon';
import { AtomText } from '../../../components/atoms/atom-text/atom-text';
import { AtomHeading } from '../../../components/atoms/atom-heading/atom-heading';
import { AtomBadge } from '../../../components/atoms/atom-badge/atom-badge';
import { AtomButton } from '../../../components/atoms/atom-button/atom-button';
import { AtomInput } from '../../../components/atoms/atom-input/atom-input';
import { AtomSelect, SelectOption } from '../../../components/atoms/atom-select/atom-select';
import { AtomSpinner } from '../../../components/atoms/atom-spinner/atom-spinner';
import { CategoryApiService, CategoryResponse, CategoryRequest } from '../../../services/category-api.service';

const PRESET_COLORS = [
  '#10b981', '#0d9488', '#059669', '#22c55e',
  '#6366f1', '#818cf8', '#4f46e5', '#a855f7', '#9333ea',
  '#f59e0b', '#d97706', '#f97316',
  '#ef4444', '#f43f5e', '#fb7185', '#ec4899', '#f472b6',
  '#6b7280', '#94a3b8',
];

@Component({
  selector: 'page-categories',
  imports: [
    FormsModule,
    AtomCard, AtomIcon, AtomText, AtomHeading, AtomBadge,
    AtomButton, AtomInput, AtomSelect, AtomSpinner,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class CategoriesPage implements OnInit {
  private readonly catApi = inject(CategoryApiService);

  loading = signal(true);
  categories = signal<CategoryResponse[]>([]);
  deleting = signal<number | null>(null);
  creating = signal(false);
  showForm = signal(false);

  // Form fields
  newName = signal('');
  newType = signal('VARIABLE');
  newColor = signal('#6366f1');
  newIcon = signal('category');

  presetColors = PRESET_COLORS;

  typeOptions: SelectOption[] = [
    { value: 'VARIABLE', label: 'Variável' },
    { value: 'FIXED', label: 'Fixa' },
  ];

  fixedCategories = computed(() => this.categories().filter(c => c.type === 'FIXED'));
  variableCategories = computed(() => this.categories().filter(c => c.type === 'VARIABLE'));

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

  deleteCategory(cat: CategoryResponse) {
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
