import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AtomIcon } from '../atom-icon/atom-icon';
import { AtomText } from '../atom-text/atom-text';
import { AtomBadge } from '../atom-badge/atom-badge';
import { AtomButton } from '../atom-button/atom-button';
import { AtomSpinner } from '../atom-spinner/atom-spinner';
import { GoalResponse } from '../../../services/dashboard-api.service';

@Component({
  selector: 'atom-objective-card',
  imports: [DatePipe, AtomIcon, AtomText, AtomBadge, AtomButton, AtomSpinner],
  templateUrl: './atom-objective-card.html',
  styleUrl: './atom-objective-card.scss',
  host: { '[class.completed]': 'goal().status === "COMPLETED"' },
})
export class AtomObjectiveCard {
  goal = input.required<GoalResponse>();
  deleting = input(false);

  deleted = output<GoalResponse>();
  statusChanged = output<{ goal: GoalResponse; status: string }>();
  edited = output<GoalResponse>();

  accentColor = computed(() => this.goal().color || 'var(--color-primary)');
  iconName = computed(() => this.goal().icon || 'flag');

  statusLabel = computed(() => {
    const map: Record<string, string> = {
      IN_PROGRESS: 'Em andamento',
      COMPLETED: 'Concluído',
      DELAYED: 'Atrasado',
      CANCELLED: 'Cancelado',
    };
    return map[this.goal().status] ?? this.goal().status;
  });

  statusVariant = computed<'primary' | 'success' | 'warning' | 'danger'>(() => {
    const map: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
      IN_PROGRESS: 'primary',
      COMPLETED: 'success',
      DELAYED: 'warning',
      CANCELLED: 'danger',
    };
    return map[this.goal().status] ?? 'primary';
  });

  isOverdue = computed(() => {
    const d = this.goal().deadline;
    if (!d || this.goal().status === 'COMPLETED' || this.goal().status === 'CANCELLED') return false;
    return new Date(d) < new Date();
  });

  daysLeft = computed(() => {
    const d = this.goal().deadline;
    if (!d) return null;
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
    return diff;
  });
}
