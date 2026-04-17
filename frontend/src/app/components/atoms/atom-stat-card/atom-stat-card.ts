import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AtomCard } from '../atom-card/atom-card';
import { AtomIcon } from '../atom-icon/atom-icon';
import { AtomText } from '../atom-text/atom-text';

@Component({
  selector: 'atom-stat-card',
  imports: [AtomCard, AtomIcon, AtomText],
  templateUrl: './atom-stat-card.html',
  styleUrl: './atom-stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomStatCard {
  icon = input('trending_up');
  iconColor = input('var(--color-primary)');
  label = input('');
  variant = input<'income' | 'expense' | 'default'>('default');
}
