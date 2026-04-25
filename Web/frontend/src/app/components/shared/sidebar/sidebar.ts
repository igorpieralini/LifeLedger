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
}
