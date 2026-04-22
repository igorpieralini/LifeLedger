import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/goals/goals').then(m => m.GoalsPage) },
];
