import { Routes } from '@angular/router';

export const goalsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./goal-list/goal-list.component').then(m => m.GoalListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./goal-detail/goal-detail.component').then(m => m.GoalDetailComponent)
  }
];
