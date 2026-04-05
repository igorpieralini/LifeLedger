import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AtomIcon } from '../atom-icon/atom-icon';

@Component({
  selector: 'atom-nav-item',
  imports: [RouterLink, RouterLinkActive, AtomIcon],
  templateUrl: './atom-nav-item.html',
  styleUrl: './atom-nav-item.scss',
})
export class AtomNavItem {
  icon = input<string>('');
  label = input<string>('');
  route = input.required<string>();
  badge = input<string | number | null>(null);
  collapsed = input<boolean>(false);

  clicked = output<void>();
}
