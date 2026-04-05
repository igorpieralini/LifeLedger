import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AtomIcon } from '../../atoms/atom-icon/atom-icon';
import { AtomText } from '../../atoms/atom-text/atom-text';
import { AtomDivider } from '../../atoms/atom-divider/atom-divider';
import { AtomHeading } from '../../atoms/atom-heading/atom-heading';

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
  imports: [RouterLink, RouterLinkActive, AtomIcon, AtomText, AtomDivider, AtomHeading],
  templateUrl: './shared-sidebar.html',
  styleUrl: './shared-sidebar.scss',
})
export class SharedSidebar {
  groups = input<SidebarGroup[]>([]);
  collapsed = input<boolean>(false);

  itemClicked = output<SidebarItem>();
}
