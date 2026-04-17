import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedSidebar, SidebarGroup } from '../shared-sidebar/shared-sidebar';
import { SharedHeader } from '../shared-header/shared-header';
import { SharedFooter } from '../shared-footer/shared-footer';
import { AuthStateService } from '../../../services/auth-state.service';

@Component({
  selector: 'shared-master',
  imports: [RouterOutlet, SharedSidebar, SharedHeader, SharedFooter],
  templateUrl: './shared-master.html',
  styleUrl: './shared-master.scss',
})
export class SharedMaster {
  private readonly authState = inject(AuthStateService);

  sidebarCollapsed = signal(false);

  userName = computed(() => this.authState.user()?.name ?? 'Usuário');
  userEmail = computed(() => this.authState.user()?.email ?? '');

  readonly sidebarGroups: SidebarGroup[] = [
    {
      title: 'Principal',
      items: [
        { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
      ],
    },
    {
      title: 'Finanças',
      items: [
        { icon: 'receipt_long', label: 'Transações', route: '/transactions' },
        { icon: 'category', label: 'Categorias', route: '/categories' },
        { icon: 'tune', label: 'Limites', route: '/limits' },
        { icon: 'upload_file', label: 'Importar', route: '/import' },
      ],
    },
    {
      title: 'Metas',
      items: [
        { icon: 'work', label: 'Carreira', route: '/goals' },
        { icon: 'school', label: 'Estudos', route: '/studies' },
        { icon: 'trending_up', label: 'Crescimento', route: '/growth' },
      ],
    },
  ];

  onToggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  onLogout() {
    this.authState.logout();
  }
}
