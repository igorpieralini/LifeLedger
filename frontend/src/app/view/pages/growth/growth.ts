import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedObjectiveBoard, BoardConfig } from '../../../components/shared/shared-objective-board/shared-objective-board';

const CONFIG: BoardConfig = {
  category: 'GROWTH',
  eyebrow: 'Metas · Crescimento',
  title: 'Crescimento',
  description: 'Desenvolva habilidades como comunicação, liderança, inteligência emocional e hábitos saudáveis.',
  heroIcon: 'trending_up',
  accentColor: '#10b981',
  emptyIcon: 'trending_up',
  emptyTitle: 'Nenhum objetivo de crescimento',
  emptyDescription: 'Comece a mapear suas soft skills e hábitos que deseja aprimorar.',
  presetIcons: [
    'self_improvement', 'psychology', 'fitness_center', 'spa', 'favorite',
    'mindfulness', 'directions_run', 'local_fire_department', 'bolt', 'mood',
    'water_drop', 'emoji_events', 'health_and_safety', 'nightlight', 'eco',
  ],
  presetColors: [
    '#10b981', '#059669', '#22c55e', '#0d9488', '#14b8a6',
    '#f59e0b', '#d97706',
    '#6366f1', '#a855f7',
    '#ef4444', '#0ea5e9',
    '#ec4899',
  ],
};

@Component({
  selector: 'page-growth',
  imports: [SharedObjectiveBoard],
  template: `<shared-objective-board [config]="config" />`,
  styles: ':host { display: contents; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrowthPage {
  readonly config = CONFIG;
}
