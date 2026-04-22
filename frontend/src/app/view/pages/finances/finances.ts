import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedObjectiveBoard, BoardConfig } from '../../../components/shared/shared-objective-board/shared-objective-board';

const CONFIG: BoardConfig = {
  category: 'FINANCE',
  eyebrow: 'Metas · Finanças',
  title: 'Finanças',
  description: 'Liste o que deseja comprar, quanto precisa juntar e acompanhe o progresso até conquistar.',
  heroIcon: 'savings',
  accentColor: '#f59e0b',
  emptyIcon: 'savings',
  emptyTitle: 'Nenhum objetivo financeiro',
  emptyDescription: 'Adicione aquilo que deseja comprar ou conquistar financeiramente.',
  presetIcons: [
    'savings', 'account_balance', 'credit_card', 'shopping_cart', 'directions_car',
    'flight', 'home', 'laptop_mac', 'phone_iphone', 'headphones',
    'diamond', 'wallet', 'redeem', 'paid', 'storefront',
  ],
  presetColors: [
    '#f59e0b', '#d97706', '#f97316', '#eab308',
    '#10b981', '#059669',
    '#6366f1', '#a855f7',
    '#ef4444', '#0ea5e9',
    '#ec4899', '#22c55e',
  ],
};

@Component({
  selector: 'page-finances',
  imports: [SharedObjectiveBoard],
  template: `<shared-objective-board [config]="config" />`,
  styles: ':host { display: contents; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesPage {
  readonly config = CONFIG;
}
