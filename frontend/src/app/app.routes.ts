import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./view/main').then(m => m.MainView),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./view/pages/dashboard/dashboard').then(m => m.DashboardPage),
      },
    ],
  },
];
