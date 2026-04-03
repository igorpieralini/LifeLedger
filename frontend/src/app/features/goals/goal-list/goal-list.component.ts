import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { GoalService } from '../../../core/services/goal.service';
import { Goal } from '../../../core/models/goal.model';
import { GoalFormDialogComponent } from '../goal-form/goal-form-dialog.component';

@Component({
  selector: 'll-goal-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, DatePipe, DecimalPipe,
    MatIconModule, MatButtonModule, MatMenuModule
  ],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.scss'
})
export class GoalListComponent implements OnInit {
  goals        = signal<Goal[]>([]);
  loading      = signal(true);
  year         = signal(new Date().getFullYear());
  creatingSuggested = signal(false);

  years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i);

  statusSummary = computed(() => {
    const g = this.goals();
    return [
      {
        label: 'Em andamento', icon: 'hourglass_empty',
        count: g.filter(x => x.status === 'IN_PROGRESS').length,
        textClass: 'text-indigo',
        accent: 'var(--indigo)', accentDim: 'var(--indigo-dim)'
      },
      {
        label: 'Concluídas', icon: 'check_circle_outline',
        count: g.filter(x => x.status === 'COMPLETED').length,
        textClass: 'text-emerald',
        accent: 'var(--emerald)', accentDim: 'var(--emerald-dim)'
      },
      {
        label: 'Atrasadas', icon: 'warning_amber',
        count: g.filter(x => x.status === 'DELAYED').length,
        textClass: 'text-rose',
        accent: 'var(--rose)', accentDim: 'var(--rose-dim)'
      },
    ];
  });

  constructor(private goalService: GoalService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.goalService.findAll(this.year()).subscribe({
      next:  g => { this.goals.set(g); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  changeYear(delta: number) {
    this.year.update(y => y + delta);
    this.load();
  }

  openPanel(goal?: Goal) {
    const ref = this.dialog.open(GoalFormDialogComponent, {
      width: '520px',
      maxWidth: 'calc(100vw - 24px)',
      disableClose: false,
      panelClass: 'modal-dialog',
      data: goal ? { goal } : {}
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.load();
    });
  }

  delete(goal: Goal) {
    if (!confirm(`Excluir a meta "${goal.title}"?`)) return;
    this.goalService.delete(goal.id).subscribe(() => this.load());
  }

  createSuggestedGoals() {
    this.creatingSuggested.set(true);
    const y = this.year();
    const templates = [
      { title: 'Saude', description: 'Rotina de exercicios e bem-estar', year: y, financial: false },
      { title: 'Vida pessoal', description: 'Qualidade de vida, familia e lazer', year: y, financial: false },
      { title: 'Conhecimento', description: 'Aprendizado continuo e desenvolvimento', year: y, financial: false },
      { title: 'Roupas', description: 'Planejamento de organizacao e renovacao de guarda-roupa', year: y, financial: false }
    ];

    forkJoin(templates.map(t => this.goalService.create(t as any))).subscribe({
      next: () => {
        this.creatingSuggested.set(false);
        this.load();
      },
      error: () => this.creatingSuggested.set(false)
    });
  }

  statusLabel(s: string) {
    return ({
      IN_PROGRESS: 'Em andamento',
      COMPLETED:   'Concluída',
      DELAYED:     'Atrasada',
      CANCELLED:   'Cancelada'
    } as any)[s] ?? s;
  }

  statusBadge(s: string) {
    return 'badge-' + (({
      IN_PROGRESS: 'indigo',
      COMPLETED:   'emerald',
      DELAYED:     'rose',
      CANCELLED:   'muted'
    } as any)[s] ?? 'muted');
  }

  statusBarClass(s: string) {
    return 'bar-' + (({
      IN_PROGRESS: 'indigo',
      COMPLETED:   'emerald',
      DELAYED:     'rose',
      CANCELLED:   'muted'
    } as any)[s] ?? 'muted');
  }
}
