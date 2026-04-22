import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedObjectiveBoard, BoardConfig } from '../../../components/shared/shared-objective-board/shared-objective-board';

const CONFIG: BoardConfig = {
  category: 'STUDIES',
  eyebrow: 'Metas · Estudos',
  title: 'Estudos',
  description: 'Organize cursos, certificações, livros e tudo que deseja aprender para evoluir.',
  heroIcon: 'school',
  accentColor: '#0ea5e9',
  emptyIcon: 'school',
  emptyTitle: 'Nenhum objetivo de estudo',
  emptyDescription: 'Adicione livros para ler, cursos para concluir e certificações para conquistar.',
  presetIcons: [
    'school', 'menu_book', 'auto_stories', 'library_books', 'history_edu',
    'science', 'psychology', 'language', 'code', 'draw',
    'podcasts', 'ondemand_video', 'workspace_premium', 'neurology', 'terminal',
  ],
  presetColors: [
    '#0ea5e9', '#0284c7', '#38bdf8', '#06b6d4', '#0891b2',
    '#6366f1', '#818cf8',
    '#10b981', '#059669',
    '#f59e0b', '#ef4444',
    '#a855f7',
  ],
};

@Component({
  selector: 'page-studies',
  imports: [SharedObjectiveBoard],
  template: `<shared-objective-board [config]="config" />`,
  styles: ':host { display: contents; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudiesPage {
  readonly config = CONFIG;
}
