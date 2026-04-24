import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  { path: 'dash', loadComponent: () => import('./pages/dash/dash').then(m => m.DashPage) },
  { path: 'metas/:slug', loadComponent: () => import('./pages/goals/goals').then(m => m.GoalsPage) },
  { path: 'regras/calendario', loadComponent: () => import('./pages/calendario/calendario').then(m => m.CalendarioPage) },
  { path: 'regras/aplicativos', loadComponent: () => import('./pages/aplicativos/aplicativos').then(m => m.AplicativosPage) },
  { path: 'regras/financas', loadComponent: () => import('./pages/financas/financas').then(m => m.FinancasPage) },
  { path: 'regras/jogos', loadComponent: () => import('./pages/jogos/jogos').then(m => m.JogosPage) },
];
