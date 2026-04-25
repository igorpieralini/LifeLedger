import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import {
  CATEGORIES, CategoryInfo, Goal, GoalCategory,
  GoalRequest, GoalStatus, STATUS_CYCLE, SLUG_TO_CATEGORY,
} from '../../models/goal.model';
import { GoalCardComponent } from '../../components/overview/goal-card/goal-card';
import { GoalFormComponent } from '../../components/overview/goal-form/goal-form';
import { EmptyStateComponent } from '../../components/shared/empty-state/empty-state';
import { LoadingComponent } from '../../components/shared/loading/loading';
import { IconComponent } from '../../components/atoms/icon/icon';

@Component({
  selector: 'page-goals',
  imports: [
    IconComponent,
    GoalCardComponent, GoalFormComponent,
    EmptyStateComponent, LoadingComponent,
  ],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class GoalsPage implements OnInit {
  private readonly api = inject(GoalService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;

  goals = signal<Goal[]>([]);
  loading = signal(true);
  activeCategory = signal<GoalCategory>('HEALTH');
  showForm = signal(false);
  editingGoal = signal<Goal | null>(null);
  saving = signal(false);
  expandedGoalId = signal<number | null>(null);
  addingSubTaskId = signal<number | null>(null);

  categoryInfo = computed(() =>
    this.categories.find(c => c.value === this.activeCategory())!
  );

  filteredGoals = computed(() => {
    const cat = this.activeCategory();
    return this.goals().filter(g => g.category === cat);
  });

  stats = computed(() => {
    const filtered = this.filteredGoals();
    return {
      total: filtered.length,
      completed: filtered.filter(g => g.status === 'COMPLETED').length,
      inProgress: filtered.filter(g => g.status === 'IN_PROGRESS').length,
    };
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'] as string;
      const cat = SLUG_TO_CATEGORY[slug];
      if (cat) {
        this.activeCategory.set(cat);
        this.load();
      }
    });
  }

  load() {
    this.loading.set(true);
    this.api.list().subscribe({
      next: goals => { this.goals.set(goals); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  getCategoryInfo(cat: GoalCategory): CategoryInfo {
    return this.categories.find(c => c.value === cat)!;
  }

  openCreate() {
    this.editingGoal.set(null);
    this.showForm.set(true);
  }

  openEdit(goal: Goal) {
    this.editingGoal.set(goal);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingGoal.set(null);
  }

  onSave(event: { request: GoalRequest; subTasks: string[] }) {
    if (this.saving()) return;
    this.saving.set(true);

    const editing = this.editingGoal();
    const done = () => { this.saving.set(false); this.closeForm(); this.load(); };
    const fail = () => { this.saving.set(false); };

    const saveSubs = (goalId: number) => {
      const subRequests = event.subTasks.map(t => ({ title: t }));
      if (subRequests.length === 0) { done(); return; }
      this.api.replaceSubTasks(goalId, subRequests).subscribe({ next: () => done(), error: () => done() });
    };

    if (editing) {
      this.api.update(editing.id, event.request).subscribe({
        next: () => saveSubs(editing.id),
        error: fail,
      });
    } else {
      this.api.create(event.request).subscribe({
        next: goal => saveSubs(goal.id),
        error: fail,
      });
    }
  }

  cycleStatus(goal: Goal) {
    const next = STATUS_CYCLE[goal.status];
    const progress = next === 'COMPLETED' ? 100 : goal.progress;
    this.goals.update(goals => goals.map(g =>
      g.id === goal.id ? { ...g, status: next, progress } : g
    ));
    this.api.updateStatus(goal.id, next).subscribe({ error: () => this.load() });
  }

  remove(goal: Goal) {
    this.goals.update(goals => goals.filter(g => g.id !== goal.id));
    this.api.delete(goal.id).subscribe({ error: () => this.load() });
  }

  toggleExpand(goalId: number) {
    this.expandedGoalId.set(this.expandedGoalId() === goalId ? null : goalId);
  }

  toggleSubTask(goal: Goal, subTaskId: number) {
    this.goals.update(goals => goals.map(g => {
      if (g.id !== goal.id) return g;
      const updatedSubs = g.subTasks.map(st =>
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      );
      const completedCount = updatedSubs.filter(st => st.completed).length;
      const progress = updatedSubs.length > 0
        ? Math.round((completedCount * 100) / updatedSubs.length)
        : g.progress;
      return { ...g, subTasks: updatedSubs, progress };
    }));
    this.api.toggleSubTask(goal.id, subTaskId).subscribe({ error: () => this.load() });
  }

  removeSubTask(goal: Goal, subTaskId: number) {
    this.goals.update(goals => goals.map(g => {
      if (g.id !== goal.id) return g;
      const updatedSubs = g.subTasks.filter(st => st.id !== subTaskId);
      const completedCount = updatedSubs.filter(st => st.completed).length;
      const progress = updatedSubs.length > 0
        ? Math.round((completedCount * 100) / updatedSubs.length)
        : 0;
      return { ...g, subTasks: updatedSubs, progress };
    }));
    this.api.deleteSubTask(goal.id, subTaskId).subscribe({ error: () => this.load() });
  }

  addSubTask(goal: Goal, title: string) {
    this.api.createSubTask(goal.id, { title }).subscribe({
      next: () => {
        this.addingSubTaskId.set(null);
        this.load();
      },
      error: () => this.addingSubTaskId.set(null),
    });
  }
}
