import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { GoalService } from '../../services/goal.service';
import {
  CATEGORIES, CategoryInfo, Goal, GoalCategory,
  GoalRequest, GoalStatus, STATUS_CYCLE, STATUS_LABELS,
} from '../../models/goal.model';

@Component({
  selector: 'page-goals',
  imports: [FormsModule, DatePipe],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class GoalsPage implements OnInit {
  private readonly api = inject(GoalService);

  readonly categories = CATEGORIES;
  readonly statusLabels = STATUS_LABELS;

  goals = signal<Goal[]>([]);
  loading = signal(true);
  activeCategory = signal<GoalCategory | 'ALL'>('ALL');
  showForm = signal(false);
  editingGoal = signal<Goal | null>(null);
  saving = signal(false);

  formTitle = '';
  formDescription = '';
  formCategory: GoalCategory = 'FINANCIAL';
  formTargetDate = '';
  formProgress = 0;

  filteredGoals = computed(() => {
    const cat = this.activeCategory();
    const all = this.goals();
    return cat === 'ALL' ? all : all.filter(g => g.category === cat);
  });

  stats = computed(() => {
    const all = this.goals();
    return {
      total: all.length,
      completed: all.filter(g => g.status === 'COMPLETED').length,
      inProgress: all.filter(g => g.status === 'IN_PROGRESS').length,
    };
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.api.list().subscribe({
      next: goals => { this.goals.set(goals); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  filterBy(cat: GoalCategory | 'ALL') {
    this.activeCategory.set(cat);
  }

  getCategoryInfo(cat: GoalCategory): CategoryInfo {
    return this.categories.find(c => c.value === cat)!;
  }

  openCreate() {
    this.editingGoal.set(null);
    this.formTitle = '';
    this.formDescription = '';
    this.formCategory = 'FINANCIAL';
    this.formTargetDate = '';
    this.formProgress = 0;
    this.showForm.set(true);
  }

  openEdit(goal: Goal) {
    this.editingGoal.set(goal);
    this.formTitle = goal.title;
    this.formDescription = goal.description ?? '';
    this.formCategory = goal.category;
    this.formTargetDate = goal.targetDate ?? '';
    this.formProgress = goal.progress;
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingGoal.set(null);
  }

  save() {
    if (!this.formTitle.trim() || this.saving()) return;
    this.saving.set(true);

    const request: GoalRequest = {
      title: this.formTitle.trim(),
      description: this.formDescription.trim() || undefined,
      category: this.formCategory,
      targetDate: this.formTargetDate || undefined,
      progress: this.formProgress,
    };

    const editing = this.editingGoal();
    const obs = editing
      ? this.api.update(editing.id, request)
      : this.api.create(request);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  cycleStatus(goal: Goal) {
    const next = STATUS_CYCLE[goal.status];
    this.api.updateStatus(goal.id, next).subscribe({ next: () => this.load() });
  }

  remove(goal: Goal) {
    this.api.delete(goal.id).subscribe({ next: () => this.load() });
  }
}
