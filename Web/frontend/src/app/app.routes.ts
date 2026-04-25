import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  { path: 'dash', loadComponent: () => import('./pages/dash/dash').then(m => m.DashPage) },
  { path: 'metas/:slug', loadComponent: () => import('./pages/goals/goals').then(m => m.GoalsPage) },
];
