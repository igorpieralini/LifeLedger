import { Component, input, output } from '@angular/core';
import { AtomIcon } from '../../atoms/atom-icon/atom-icon';
import { AtomText } from '../../atoms/atom-text/atom-text';
import { AtomDivider } from '../../atoms/atom-divider/atom-divider';
import { AtomHeading } from '../../atoms/atom-heading/atom-heading';
import { AtomNavItem } from '../../atoms/atom-nav-item/atom-nav-item';

export interface SidebarItem {
  icon: string;
  label: string;
  route: string;
  badge?: string | number;
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

@Component({
  selector: 'shared-sidebar',
  imports: [AtomIcon, AtomText, AtomDivider, AtomHeading, AtomNavItem],
  templateUrl: './shared-sidebar.html',
  styleUrl: './shared-sidebar.scss',
})
export class SharedSidebar {
  groups = input<SidebarGroup[]>([]);
  collapsed = input<boolean>(false);

  itemClicked = output<SidebarItem>();
}
