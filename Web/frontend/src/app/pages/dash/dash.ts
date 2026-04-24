import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { GoalService } from '../../services/goal.service';
import { Goal, CATEGORIES, GoalCategory } from '../../models/goal.model';
import { ProgressBarComponent } from '../../components/atoms/progress-bar/progress-bar';

@Component({
  selector: 'page-dash',
  standalone: true,
  imports: [ProgressBarComponent],
  templateUrl: './dash.html',
  styleUrl: './dash.scss',
})
export class DashPage implements OnInit {
  private readonly api = inject(GoalService);

  goals = signal<Goal[]>([]);
  readonly categories = CATEGORIES;

  total = computed(() => this.goals().length);
  completed = computed(() => this.goals().filter(g => g.status === 'COMPLETED').length);
  inProgress = computed(() => this.goals().filter(g => g.status === 'IN_PROGRESS').length);
  notStarted = computed(() => this.goals().filter(g => g.status === 'NOT_STARTED').length);

  avgProgress = computed(() => {
    const all = this.goals();
    if (all.length === 0) return 0;
    return Math.round(all.reduce((sum, g) => sum + g.progress, 0) / all.length);
  });

  categoryCounts = computed(() =>
    this.categories.map(cat => {
      const catGoals = this.goals().filter(g => g.category === cat.value);
      const done = catGoals.filter(g => g.status === 'COMPLETED').length;
      const avg = catGoals.length > 0
        ? Math.round(catGoals.reduce((s, g) => s + g.progress, 0) / catGoals.length)
        : 0;
      return { ...cat, count: catGoals.length, completed: done, avgProgress: avg };
    })
  );

  recentGoals = computed(() =>
    [...this.goals()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  );

  ngOnInit() {
    this.api.list().subscribe(goals => this.goals.set(goals));
  }

  getCatIcon(cat: GoalCategory): string {
    return this.categories.find(c => c.value === cat)?.icon ?? 'flag';
  }
}
