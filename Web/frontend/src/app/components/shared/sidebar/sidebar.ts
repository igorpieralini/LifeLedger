import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CATEGORIES } from '../../../models/goal.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  readonly categories = CATEGORIES;

  readonly categoryRoutes = [
    { path: '/metas/financeiras', label: 'Financeiras', icon: 'savings', color: '#10b981' },
    { path: '/metas/academicas',  label: 'Acadêmicas',  icon: 'school',  color: '#3b82f6' },
    { path: '/metas/habilidades', label: 'Habilidades', icon: 'bolt',    color: '#8b5cf6' },
    { path: '/metas/saude',       label: 'Saúde',       icon: 'favorite',color: '#f43f5e' },
  ];

  readonly ruleRoutes = [
    { path: '/regras/calendario',  label: 'Calendário',  icon: 'calendar_month',         color: '#f59e0b' },
    { path: '/regras/aplicativos', label: 'Aplicativos', icon: 'apps',                   color: '#3b82f6' },
    { path: '/regras/financas',    label: 'Finanças',    icon: 'account_balance_wallet', color: '#10b981' },
    { path: '/regras/jogos',       label: 'Jogos',       icon: 'sports_esports',         color: '#ef4444' },
  ];
}
