import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedObjectiveBoard, BoardConfig } from '../../../components/shared/shared-objective-board/shared-objective-board';

const CONFIG: BoardConfig = {
  category: 'CAREER',
  eyebrow: 'Metas · Carreira',
  title: 'Carreira',
  description: 'Trace objetivos profissionais, promoções, mudanças de cargo e conquistas na sua trajetória.',
  heroIcon: 'work',
  accentColor: '#6366f1',
  emptyIcon: 'work',
  emptyTitle: 'Nenhum objetivo de carreira',
  emptyDescription: 'Crie seu primeiro objetivo para traçar seu caminho profissional.',
  presetIcons: [
    'work', 'rocket_launch', 'trending_up', 'emoji_events', 'military_tech',
    'star', 'handshake', 'groups', 'leaderboard', 'code',
    'engineering', 'workspace_premium', 'monitoring', 'target', 'shield_person',
  ],
  presetColors: [
    '#6366f1', '#818cf8', '#4f46e5', '#a855f7', '#9333ea',
    '#3b82f6', '#2563eb', '#0ea5e9',
    '#10b981', '#059669',
    '#f59e0b', '#ef4444',
  ],
};

@Component({
  selector: 'page-goals',
  imports: [SharedObjectiveBoard],
  template: `<shared-objective-board [config]="config" />`,
  styles: ':host { display: contents; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsPage {
  readonly config = CONFIG;
}
