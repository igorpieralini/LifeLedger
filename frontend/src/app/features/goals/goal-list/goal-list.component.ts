import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GoalService } from '../../../core/services/goal.service';
import { Goal } from '../../../core/models/goal.model';

@Component({
  selector: 'll-goal-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, DatePipe, DecimalPipe,
    MatIconModule, MatButtonModule, MatMenuModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.scss'
})
export class GoalListComponent implements OnInit {
  goals        = signal<Goal[]>([]);
  loading      = signal(true);
  year         = signal(new Date().getFullYear());
  panelOpen    = signal(false);
  panelLoading = signal(false);
  panelError   = signal('');
  editingGoal  = signal<Goal | null>(null);

  years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i);

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    year:        [new Date().getFullYear(), Validators.required],
    targetValue: [null as number | null],
    deadline:    ['' as string]
  });

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

  constructor(private goalService: GoalService, private fb: FormBuilder) {}

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
    this.editingGoal.set(goal ?? null);
    this.panelError.set('');
    this.panelLoading.set(false);
    this.form.reset({
      title:       goal?.title       ?? '',
      description: goal?.description ?? '',
      year:        goal?.year        ?? new Date().getFullYear(),
      targetValue: goal?.targetValue ?? null,
      deadline:    goal?.deadline    ?? ''
    });
    this.panelOpen.set(true);
  }

  closePanel() {
    this.panelOpen.set(false);
    this.editingGoal.set(null);
    this.panelError.set('');
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.panelLoading.set(true);
    this.panelError.set('');

    const val = this.form.value;
    const request: any = {
      title:       val.title,
      description: val.description || undefined,
      year:        Number(val.year),
      targetValue: val.targetValue ? Number(val.targetValue) : undefined,
      deadline:    val.deadline    || undefined
    };

    const goal = this.editingGoal();
    const op   = goal
      ? this.goalService.update(goal.id, request)
      : this.goalService.create(request);

    op.subscribe({
      next: () => { this.closePanel(); this.load(); },
      error: (err) => {
        this.panelError.set(this.parseError(err, 'Erro ao salvar meta'));
        this.panelLoading.set(false);
      }
    });
  }

  private parseError(err: any, fallback: string): string {
    const msg = err?.error?.message;
    if (!msg) return fallback;
    if (typeof msg === 'string') return msg;
    if (typeof msg === 'object') {
      const first = Object.values(msg)[0];
      return typeof first === 'string' ? first : fallback;
    }
    return fallback;
  }

  delete(goal: Goal) {
    if (!confirm(`Excluir a meta "${goal.title}"?`)) return;
    this.goalService.delete(goal.id).subscribe(() => this.load());
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
