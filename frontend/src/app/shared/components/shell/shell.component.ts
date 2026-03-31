import { Component, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem { label: string; icon: string; route: string; exact?: boolean; }
interface NavGroup { label?: string; items: NavItem[]; }

@Component({
  selector: 'll-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  open = signal(true);
  user = this.auth.currentUser;
  initial = computed(() => this.user()?.name?.charAt(0).toUpperCase() ?? '?');

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
        { label: 'Transações',  icon: 'receipt_long', route: '/finances',         exact: true },
        { label: 'Relatório',   icon: 'bar_chart',    route: '/finances/summary'              }
      ]
    }
  ];

  constructor(private auth: AuthService) {}

  toggle() { this.open.update(v => !v); }
  logout() { this.auth.logout(); }
}
