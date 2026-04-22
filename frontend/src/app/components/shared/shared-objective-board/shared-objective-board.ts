import {
  ChangeDetectionStrategy, Component, computed, inject,
  input, OnInit, signal,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AtomCard } from '../../atoms/atom-card/atom-card';
import { AtomIcon } from '../../atoms/atom-icon/atom-icon';
import { AtomText } from '../../atoms/atom-text/atom-text';
import { AtomHeading } from '../../atoms/atom-heading/atom-heading';
import { AtomButton } from '../../atoms/atom-button/atom-button';
import { AtomInput } from '../../atoms/atom-input/atom-input';
import { AtomSelect, SelectOption } from '../../atoms/atom-select/atom-select';
import { AtomSpinner } from '../../atoms/atom-spinner/atom-spinner';
import { AtomFeedbackState } from '../../atoms/atom-feedback-state/atom-feedback-state';
import { AtomObjectiveCard } from '../../atoms/atom-objective-card/atom-objective-card';
import { SharedPopup } from '../shared-popup/shared-popup';
import { GoalApiService, GoalCategory, GoalRequest } from '../../../services/goal-api.service';
import { GoalResponse } from '../../../services/dashboard-api.service';

export interface BoardConfig {
  category: GoalCategory;
  eyebrow: string;
  title: string;
  description: string;
  heroIcon: string;
  accentColor: string;
  emptyIcon: string;
  emptyTitle: string;
  emptyDescription: string;
  presetIcons: string[];
  presetColors: string[];
}

@Component({
  selector: 'shared-objective-board',
  imports: [
    DatePipe, DecimalPipe,
    AtomCard, AtomIcon, AtomText, AtomHeading,
    AtomButton, AtomInput, AtomSelect, AtomSpinner,
    AtomFeedbackState, AtomObjectiveCard, SharedPopup,
  ],
  templateUrl: './shared-objective-board.html',
  styleUrl: './shared-objective-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedObjectiveBoard implements OnInit {
  private readonly goalApi = inject(GoalApiService);

  config = input.required<BoardConfig>();

  // State
  loading = signal(true);
  goals = signal<GoalResponse[]>([]);
  showForm = signal(false);
  creating = signal(false);
  deleting = signal<number | null>(null);
  searchTerm = signal('');
  filterStatus = signal('ALL');
  editingGoal = signal<GoalResponse | null>(null);

  // Form fields
  newTitle = signal('');
  newDescription = signal('');
  newYear = signal(new Date().getFullYear().toString());
  newDeadline = signal('');
  newIcon = signal('');
  newColor = signal('');
  newTargetValue = signal('');

  statusOptions: SelectOption[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'COMPLETED', label: 'Concluídos' },
    { value: 'DELAYED', label: 'Atrasados' },
    { value: 'CANCELLED', label: 'Cancelados' },
  ];

  // Computed
  filteredGoals = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.filterStatus();
    let list = this.goals();
    if (status !== 'ALL') list = list.filter(g => g.status === status);
    if (term) {
      list = list.filter(g =>
        g.title.toLowerCase().includes(term) ||
        (g.description ?? '').toLowerCase().includes(term)
      );
    }
    return list;
  });

  readonly MAX_GOALS = 4;
  maxReached = computed(() => this.goals().length >= this.MAX_GOALS);

  totalGoals = computed(() => this.goals().length);
  completedGoals = computed(() => this.goals().filter(g => g.status === 'COMPLETED').length);
  inProgressGoals = computed(() => this.goals().filter(g => g.status === 'IN_PROGRESS').length);
  avgProgress = computed(() => {
    const list = this.goals();
    if (list.length === 0) return 0;
    return Math.round(list.reduce((sum, g) => sum + g.progress, 0) / list.length);
  });
  hasActiveSearch = computed(() =>
    this.searchTerm().trim().length > 0 || this.filterStatus() !== 'ALL'
  );
  canCreate = computed(() => this.newTitle().trim().length > 0);
  isEditing = computed(() => this.editingGoal() !== null);

  ngOnInit() {
    this.newIcon.set(this.config().presetIcons[0] ?? 'flag');
    this.newColor.set(this.config().presetColors[0] ?? '#6366f1');
    this.loadGoals();
  }

  loadGoals() {
    this.loading.set(true);
    this.goalApi.list(undefined, this.config().category).subscribe({
      next: goals => { this.goals.set(goals); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  toggleForm() {
    this.editingGoal.set(null);
    this.showForm.update(v => !v);
    if (!this.showForm()) this.resetForm();
  }

  openEdit(goal: GoalResponse) {
    this.editingGoal.set(goal);
    this.newTitle.set(goal.title);
    this.newDescription.set(goal.description ?? '');
    this.newYear.set(goal.year.toString());
    this.newDeadline.set(goal.deadline ?? '');
    this.newIcon.set(goal.icon ?? this.config().presetIcons[0] ?? 'flag');
    this.newColor.set(goal.color ?? this.config().presetColors[0] ?? '#6366f1');
    this.newTargetValue.set(goal.targetValue?.toString() ?? '');
    this.showForm.set(true);
  }

  resetForm() {
    this.newTitle.set('');
    this.newDescription.set('');
    this.newYear.set(new Date().getFullYear().toString());
    this.newDeadline.set('');
    this.newIcon.set(this.config().presetIcons[0] ?? 'flag');
    this.newColor.set(this.config().presetColors[0] ?? '#6366f1');
    this.newTargetValue.set('');
    this.editingGoal.set(null);
  }

  selectIcon(icon: string) { this.newIcon.set(icon); }
  selectColor(color: string) { this.newColor.set(color); }
  clearFilters() { this.searchTerm.set(''); this.filterStatus.set('ALL'); }

  saveGoal() {
    if (!this.canCreate() || this.creating()) return;
    if (!this.editingGoal() && this.maxReached()) return;
    this.creating.set(true);

    const req: GoalRequest = {
      title: this.newTitle().trim(),
      description: this.newDescription().trim() || undefined,
      year: parseInt(this.newYear(), 10) || new Date().getFullYear(),
      category: this.config().category,
      icon: this.newIcon(),
      color: this.newColor(),
      targetValue: this.newTargetValue() ? parseFloat(this.newTargetValue()) : undefined,
      deadline: this.newDeadline() || undefined,
    };

    const editing = this.editingGoal();
    const obs = editing
      ? this.goalApi.update(editing.id, req)
      : this.goalApi.create(req);

    obs.subscribe({
      next: () => {
        this.creating.set(false);
        this.showForm.set(false);
        this.resetForm();
        this.loadGoals();
      },
      error: () => this.creating.set(false),
    });
  }

  deleteGoal(goal: GoalResponse) {
    if (this.deleting() !== null) return;
    this.deleting.set(goal.id);
    this.goalApi.delete(goal.id).subscribe({
      next: () => {
        this.goals.update(list => list.filter(g => g.id !== goal.id));
        this.deleting.set(null);
      },
      error: () => this.deleting.set(null),
    });
  }

  changeStatus(event: { goal: GoalResponse; status: string }) {
    this.goalApi.updateStatus(event.goal.id, event.status).subscribe({
      next: () => this.loadGoals(),
    });
  }
}
