import { Component, EventEmitter, HostBinding, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavItem  { label: string; icon: string; route: string; exact?: boolean; }
interface NavGroup { label?: string; items: NavItem[]; }

@Component({
  selector: 'll-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Output() collapsedChange = new EventEmitter<boolean>();

  /** Starts open on desktop, closed on mobile (overlay behaviour). */
  open = signal(window.innerWidth > 768);

  @HostBinding('class.collapsed') get isCollapsed() { return !this.open(); }

  navGroups: NavGroup[] = [
    {
      items: [{ label: 'Dashboard', icon: 'dashboard', route: '/dashboard', exact: true }]
    },
    {
      label: 'Metas',
      items: [
        { label: 'Metas', icon: 'track_changes', route: '/goals' }
      ]
    },
    {
      label: 'Finanças',
      items: [
        { label: 'Histórico', icon: 'receipt_long', route: '/finances/history', exact: true },
        { label: 'Análises',  icon: 'analytics',   route: '/finances/analysis'              },
        { label: 'Limites',   icon: 'speed',        route: '/finances/limits'               },
        { label: 'Relatório', icon: 'bar_chart',    route: '/finances/summary'              }
      ]
    }
  ];

  toggle() {
    this.open.update(v => !v);
    this.collapsedChange.emit(!this.open());
  }
}
