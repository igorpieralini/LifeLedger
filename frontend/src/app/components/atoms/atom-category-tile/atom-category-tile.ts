import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AtomBadge } from '../atom-badge/atom-badge';
import { AtomButton } from '../atom-button/atom-button';
import { AtomIcon } from '../atom-icon/atom-icon';
import { AtomSpinner } from '../atom-spinner/atom-spinner';

export interface CategoryTileData {
  id: number;
  name: string;
  type: string;
  icon?: string | null;
  color?: string | null;
}

@Component({
  selector: 'atom-category-tile',
  imports: [AtomBadge, AtomButton, AtomIcon, AtomSpinner],
  templateUrl: './atom-category-tile.html',
  styleUrl: './atom-category-tile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomCategoryTile {
  category = input.required<CategoryTileData>();
  deleting = input(false);
  deleted = output<CategoryTileData>();
}
